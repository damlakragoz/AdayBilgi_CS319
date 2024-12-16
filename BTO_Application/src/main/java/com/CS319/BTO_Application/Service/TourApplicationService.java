package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Controller.TourApplicationController;
import com.CS319.BTO_Application.Controller.TourController;
import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Repos.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TourApplicationService {
    private final TourApplicationRepos<TourApplication> tourApplicationRepository;
    private final TourController tourController;

    @Autowired
    public TourApplicationService(TourApplicationRepos<TourApplication> tourApplicationRepository, TourController tourController) {
        this.tourApplicationRepository = tourApplicationRepository;
        this.tourController = tourController;
    }

    public List<TourApplication> getAllTourApplications() {
        return tourApplicationRepository.findAll();
    }


    /*
    @Transactional
    public void processTourApplications() {
        System.out.println("Processing tour applications");

        LocalDateTime now = LocalDateTime.now(); // Şu anki zaman

        // "Created" durumunda olan ve işlenme zamanı gelen başvuruları al
        List<TourApplication> applications = tourApplicationRepository.findByStatusAndTransitionTime("Created", now);

        for (TourApplication application : applications) {
            boolean assigned = assignSlotWithPrioritization(application);

            if (!assigned) {
                // Eğer slot atanamadıysa, durumu "Pre-rejected" olarak ayarla
                application.setApplicationStatus("Pre-rejected");
            }

            // Güncellenen başvuru durumunu kaydet
            tourApplicationRepository.save(application);
            if(application.getApplicationStatus().equals("Pending")) {
                tourController.createTour(application.getId());
            }
        }
    }

     */

    @Transactional
    public void processTourApplications() {
        LocalDateTime now = LocalDateTime.now(); // Şu anki zaman

        // Basit query ile başvuruları al
        List<TourApplication> applications = tourApplicationRepository.findByStatusAndTransitionTime("Created", now);

        // Benzersiz ve tekrarlı başvuruları oluşturmak için Map
        Map<String, TourApplication> uniqueApplicationsMap = new HashMap<>();
        List<TourApplication> nonUniqueApplications = new ArrayList<>();

        for (TourApplication application : applications) {
            // Benzersiz key oluştur (school_id + requestedDates)
            String key = application.getApplyingHighschool().getId() + "-" +
                    application.getRequestedDates().stream()
                            .map(requestedDate -> requestedDate.getDate().toString() + "_" + requestedDate.getTimeSlot())
                            .sorted()
                            .collect(Collectors.joining(","));

            // Eğer key map'te varsa, bu tekrarlı başvurudur
            if (uniqueApplicationsMap.containsKey(key)) {
                nonUniqueApplications.add(application);
            } else {
                uniqueApplicationsMap.put(key, application); // Benzersiz başvuruyu ekle
            }
        }

        // Benzersiz başvuruları liste olarak al
        List<TourApplication> uniqueApplications = new ArrayList<>(uniqueApplicationsMap.values());

        // Unique başvuruları log'a yaz
        for (TourApplication application : uniqueApplications) {
            System.out.println("Unique application: " + application.getSelectedDate() + " | " + application.getApplicationStatus());
        }

        // Non-unique başvuruları sil
        for (TourApplication application : nonUniqueApplications) {
            System.out.println("Deleting non-unique application: " + application.getId());
            application.setApplicationStatus("Pre-rejected");
        }
        System.out.println("Deleted " + nonUniqueApplications.size() + " non-unique applications.");


        // Unique başvuruları priorityPoint ve transitionTime'a göre sırala
        List<TourApplication> sortedApplications = uniqueApplications.stream()
                .sorted(Comparator.comparingInt((TourApplication app) -> app.getApplyingHighschool().getPriorityPoint())
                        .reversed() // Büyükten küçüğe sıralama
                        .thenComparing(TourApplication::getTransitionTime)) // Aynı priorityPoint için transitionTime
                .toList();

        // İşlenmiş başvuruları sırayla işle
        for (TourApplication application : sortedApplications) {
            boolean assigned = assignSlotWithPrioritization(application);

            if (!assigned) {
                // Eğer slot atanamadıysa, durumu "Pre-rejected" olarak ayarla
                application.setApplicationStatus("Pre-rejected");
            } else {
                // Slot atandıysa, durumu "Pending" olarak ayarla
                application.setApplicationStatus("Pending");
                tourController.createTour(application.getId());
            }

            // Güncellenen başvuru durumunu kaydet
            tourApplicationRepository.save(application);
        }
    }



    /**
     * Başvuruyu istenen bir slot'a atamayı dener.
     */
    private boolean assignSlotWithPrioritization(TourApplication application) {
        for (RequestedDateTime requestedDateTime : application.getRequestedDates()) {
            LocalDate requestedDate = requestedDateTime.getDate();
            TimeSlot requestedSlot = requestedDateTime.getTimeSlot();

            // Aynı tarih ve zaman diliminde başka bir başvuru var mı kontrol et
            TourApplication conflictingApplication = tourApplicationRepository.findBySelectedDateAndSelectedTimeSlot(requestedDate, requestedSlot);

            if (conflictingApplication == null) {
                // Eğer çatışma yoksa, slot'u atayın
                application.setSelectedDate(requestedDate);
                application.setSelectedTimeSlot(requestedSlot);
                application.setApplicationStatus("Pending");
                return true; // Başarılı bir şekilde atandı
            }
            // Çakışma var ama "Pending" durumda ise, bu başvuruyu es geç
            else if (conflictingApplication.getApplicationStatus().equals("Pending")) {
                continue; // "Pending" durumundaki başvuruyu değiştirme
            }
            // Çakışma var ve "Pending" değilse, önceliklendirme yap
            else {
                // Çatışma varsa, önceliklendirme yap
                TourApplication prioritizedApplication = prioritizeSchool(application, conflictingApplication);

                if (prioritizedApplication == application) {
                    // Daha düşük öncelikli uygulamayı işleme al
                    handleLessPrioritizedSchool(conflictingApplication);

                    // Slot'u mevcut uygulamaya ata
                    application.setSelectedDate(requestedDate);
                    application.setSelectedTimeSlot(requestedSlot);
                    application.setApplicationStatus("Pending");
                    return true;
                }
            }
        }

        // Eğer hiçbir slot atanamadıysa, false döndür
        return false;
    }

    /**
     * İki başvuru arasından önceliklendirme yapar.
     */
    private TourApplication prioritizeSchool(TourApplication app1, TourApplication app2) {
        HighSchool highSchool1 = app1.getApplyingHighschool();
        HighSchool highSchool2 = app2.getApplyingHighschool();

        int priority1 = highSchool1.getPriorityPoint();
        int priority2 = highSchool2.getPriorityPoint();

        // priorityPoint'e göre karşılaştırma
        if (priority1 != priority2) {
            return (priority1 > priority2) ? app1 : app2;
        }

        // Eğer priorityPoint aynı ise, daha erken başvuru yapanı önceliklendir
        LocalDateTime transitionTime1 = app1.getTransitionTime();
        LocalDateTime transitionTime2 = app2.getTransitionTime();

        return (transitionTime1.isBefore(transitionTime2)) ? app1 : app2;
    }

    /**
     * Daha düşük öncelikli okulu bir sonraki uygun slot'a atar.
     */
    private void handleLessPrioritizedSchool(TourApplication application) {
        List<RequestedDateTime> remainingPreferences = application.getRequestedDates().subList(1, application.getRequestedDates().size());

        for (RequestedDateTime requestedDateTime : remainingPreferences) {
            LocalDate requestedDate = requestedDateTime.getDate();
            TimeSlot requestedSlot = requestedDateTime.getTimeSlot();

            // Aynı tarih ve zaman diliminde başka bir başvuru var mı kontrol et
            TourApplication conflictingApplication = tourApplicationRepository.findBySelectedDateAndSelectedTimeSlot(requestedDate, requestedSlot);

            if (conflictingApplication == null) {
                // Eğer slot boşsa, atama yap
                application.setSelectedDate(requestedDate);
                application.setSelectedTimeSlot(requestedSlot);
                application.setApplicationStatus("Pending");
                return; // Başarılı bir şekilde atandı
            }
        }

        // Eğer hiçbir slot atanamadıysa, başvuruyu "Pre-rejected" olarak işaretle
        application.setApplicationStatus("Pre-rejected");
    }


}
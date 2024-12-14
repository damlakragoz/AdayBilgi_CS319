package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Repos.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TourApplicationService {
    private final TourApplicationRepos<TourApplication> tourApplicationRepository;

    @Autowired
    public TourApplicationService(TourApplicationRepos<TourApplication> tourApplicationRepository) {
        this.tourApplicationRepository = tourApplicationRepository;
    }

    public List<TourApplication> getAllTourApplications() {
        return tourApplicationRepository.findAll();
    }


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
        }
    }

    /**
     * Başvuruyu istenen bir slot'a atamayı dener.
     */
    private boolean assignSlotWithPrioritization(TourApplication application) {
        for (RequestedDateTime requestedDateTime : application.getRequestedDates()) {
            LocalDateTime requestedDate = requestedDateTime.getDate();
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
        return (priority1 >= priority2) ? app1 : app2;
    }

    /**
     * Daha düşük öncelikli okulu bir sonraki uygun slot'a atar.
     */
    private void handleLessPrioritizedSchool(TourApplication application) {
        List<RequestedDateTime> remainingPreferences = application.getRequestedDates().subList(1, application.getRequestedDates().size());
        for (RequestedDateTime requestedDateTime : remainingPreferences) {
            LocalDateTime requestedDate = requestedDateTime.getDate();
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
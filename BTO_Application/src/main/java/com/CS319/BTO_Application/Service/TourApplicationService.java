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
    private final SchoolTourApplicationRepos schoolTourApplicationRepos;
    private final IndividualTourApplicationRepos individualTourApplicationRepos;
    private final TourController tourController;

    @Autowired
    public TourApplicationService(TourApplicationRepos<TourApplication> tourApplicationRepository, TourController tourController, SchoolTourApplicationRepos schoolTourApplicationRepos, IndividualTourApplicationRepos individualTourApplicationRepos) {
        this.tourApplicationRepository = tourApplicationRepository;
        this.tourController = tourController;
        this.schoolTourApplicationRepos = schoolTourApplicationRepos;
        this.individualTourApplicationRepos = individualTourApplicationRepos;
    }

    public List<TourApplication> getAllTourApplications() {
        return tourApplicationRepository.findAll();
    }


    /**
     * Processes all school tour applications to assign slots based on prioritization rules.
     *
     * Preconditions:
     * - The repository must contain valid `SchoolTourApplication` entities.
     * - The entities should have a status of "Created" and a valid `transitionTime`.
     *
     * Postconditions:
     * - Conflicting or duplicate applications are marked as "Pre-rejected".
     * - Unique applications are sorted by priority and processed for slot assignment.
     * - If no slot is assigned, the application is marked "Pre-rejected".
     * - If a slot is successfully assigned, the application is marked "Pending".
     */
    @Transactional
    public void processSchoolTourApplications() {
        LocalDateTime now = LocalDateTime.now(); // Şu anki zaman

        // Basit query ile başvuruları al
        List<SchoolTourApplication> applications = schoolTourApplicationRepos.findByStatusAndTransitionTime("Created", now);

        // Benzersiz ve tekrarlı başvuruları oluşturmak için Map
        Map<String, SchoolTourApplication> uniqueApplicationsMap = new HashMap<>();
        List<SchoolTourApplication> nonUniqueApplications = new ArrayList<>();

        for (SchoolTourApplication application : applications) {
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
        List<SchoolTourApplication> uniqueApplications = new ArrayList<>(uniqueApplicationsMap.values());

        // Unique başvuruları log'a yaz
        for (SchoolTourApplication application : uniqueApplications) {
            System.out.println("Unique application: " + application.getSelectedDate() + " | " + application.getApplicationStatus());
        }

        // Non-unique başvuruları sil
        for (SchoolTourApplication application : nonUniqueApplications) {
            System.out.println("Deleting non-unique application: " + application.getId());
            application.setApplicationStatus("Pre-rejected");
        }
        System.out.println("Deleted " + nonUniqueApplications.size() + " non-unique applications.");


        List<SchoolTourApplication> sortedApplications = uniqueApplications.stream()
                .sorted(Comparator.comparingInt((SchoolTourApplication app) -> app.getApplyingHighschool().getPriorityPoint())
                        .reversed() // Büyükten küçüğe sıralama
                        .thenComparing((SchoolTourApplication app) ->
                                app.getApplyingHighschool().getCity().equalsIgnoreCase("Ankara") ? 1 : 0) // Ankara olmayanlar öncelikli
                        .thenComparing(SchoolTourApplication::getApplicationTime)) // Başvuru zamanına göre artan sıralama
                .toList();


        // İşlenmiş başvuruları sırayla işle
        for (SchoolTourApplication application : sortedApplications) {

            System.out.println(application.getApplyingHighschool().getSchoolName() + "\n");
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
            schoolTourApplicationRepos.save(application);
        }
    }

    /**
     * Başvuruyu istenen bir slot'a atamayı dener.
     */

    /**
     * Attempts to assign a slot to a school tour application based on prioritization.
     *
     * Preconditions:
     * - The application must not be null.
     * - The application must have valid `requestedDates`.
     *
     * Postconditions:
     * - Assigns a slot and updates the application status to "Pending" if successful.
     * - Returns false if no slot is available.
     *
     * @param application The school tour application.
     * @return True if a slot was successfully assigned, false otherwise.
     */
    private boolean assignSlotWithPrioritization(SchoolTourApplication application) {
        for (RequestedDateTime requestedDateTime : application.getRequestedDates()) {
            LocalDate requestedDate = requestedDateTime.getDate();
            TimeSlot requestedSlot = requestedDateTime.getTimeSlot();

            // Aynı tarih ve zaman diliminde başka bir "Created" başvuru var mı kontrol et
            if(requestedDate == null || requestedSlot == null) {
                return false;
            }

            SchoolTourApplication conflictingApplication = schoolTourApplicationRepos.findBySelectedDateAndSelectedTimeSlotAndStatus
                    (requestedDate, requestedSlot, "Created");

            SchoolTourApplication pendingApplication = schoolTourApplicationRepos.findBySelectedDateAndSelectedTimeSlotAndStatus(requestedDate, requestedSlot, "Pending");

            SchoolTourApplication approvedApplication = schoolTourApplicationRepos.findBySelectedDateAndSelectedTimeSlotAndStatus(requestedDate, requestedSlot, "Approved");

            // Eğer "Pending" veya "Approved" varsa, bu slotu koru ve diğer tercihe geç
            if (pendingApplication != null || approvedApplication != null) {
                continue;
            }

            if (conflictingApplication != null) {
                // Çakışma varsa önceliklendirme yap
                SchoolTourApplication prioritizedApplication = prioritizeSchool(application, conflictingApplication);

                if (prioritizedApplication == application) {
                    handleLessPrioritizedSchool(conflictingApplication, 1);

                    application.setSelectedDate(requestedDate);
                    application.setSelectedTimeSlot(requestedSlot);
                    application.setApplicationStatus("Pending");
                    return true;
                } else {
                    continue;
                }
            }

            // Eğer çakışma yoksa slot'u atayın
            application.setSelectedDate(requestedDate);
            application.setSelectedTimeSlot(requestedSlot);
            application.setApplicationStatus("Pending");
            return true;
        }

        // Eğer hiçbir slot atanamadıysa, false döndür
        return false;
    }

    /**
     * İki başvuru arasından önceliklendirme yapar.
     */

    /**
     * Handles the prioritization of conflicting school applications.
     *
     * Preconditions:
     * - Both applications must not be null.
     * - Both applications must belong to valid high schools.
     *
     * Postconditions:
     * - Returns the application with higher priority based on school priority points.
     *
     * @param app1 The first school application.
     * @param app2 The second school application.
     * @return The prioritized school application.
     */
    private SchoolTourApplication prioritizeSchool(SchoolTourApplication app1, SchoolTourApplication app2) {
        HighSchool highSchool1 = app1.getApplyingHighschool();
        HighSchool highSchool2 = app2.getApplyingHighschool();

        int priority1 = highSchool1.getPriorityPoint();
        int priority2 = highSchool2.getPriorityPoint();

        // priorityPoint'e göre karşılaştırma
        if (priority1 != priority2) {
            return (priority1 > priority2) ? app1 : app2;
        }

        if(highSchool1.getSchoolName().equalsIgnoreCase("Ankara") && !highSchool2.getSchoolName().equalsIgnoreCase("Ankara")) {
            return app2;
        }
        else if(!highSchool1.getSchoolName().equalsIgnoreCase("Ankara") && highSchool2.getSchoolName().equalsIgnoreCase("Ankara")){
            return app1;
        }
        else{// if both are from Ankara or both from outside of Ankara
            // daha erken başvuru yapanı önceliklendir
            LocalDateTime applicationTime1 = app1.getApplicationTime();
            LocalDateTime applicationTime2 = app2.getApplicationTime();

            return (applicationTime1.isBefore(applicationTime2)) ? app1 : app2;
        }
    }

    /**
     * Daha düşük öncelikli okulu bir sonraki uygun slot'a atar.
     */

    /**
     * Attempts to assign a slot to a less prioritized school application for the next available preference.
     *
     * Preconditions:
     * - The application must not be null.
     * - The application must have valid `requestedDates` starting from the given index.
     *
     * Postconditions:
     * - If a slot is assigned, the application status is updated to "Pending".
     * - If no slot is available after iterating preferences, the application is marked "Pre-rejected".
     *
     * @param application The school tour application to handle.
     * @param start The starting index for checking preferences in the requested dates.
     */
    private void handleLessPrioritizedSchool(SchoolTourApplication application, int start) {
        if(start >= application.getRequestedDates().size()){
            // Eğer hiçbir slot atanamadıysa, başvuruyu "Pre-rejected" olarak işaretle
            application.setApplicationStatus("Pre-rejected");
            return;
        }
        List<RequestedDateTime> remainingPreferences = application.getRequestedDates().subList(start, application.getRequestedDates().size());

        for (RequestedDateTime requestedDateTime : remainingPreferences) {
            LocalDate requestedDate = requestedDateTime.getDate();
            TimeSlot requestedSlot = requestedDateTime.getTimeSlot();

            if (requestedDate == null || requestedSlot == null) {
                continue; // Geçersiz tercihleri atla
            }

            // Aynı tarih ve zaman diliminde başka bir başvuru var mı kontrol et
            SchoolTourApplication conflictingApplication = schoolTourApplicationRepos.findBySelectedDateAndSelectedTimeSlotAndStatus
                    (requestedDate, requestedSlot, "Created");
            SchoolTourApplication pendingApplication = schoolTourApplicationRepos.findBySelectedDateAndSelectedTimeSlotAndStatus
                    (requestedDate, requestedSlot, "Pending");
            SchoolTourApplication approvedApplication = schoolTourApplicationRepos.findBySelectedDateAndSelectedTimeSlotAndStatus
                    (requestedDate, requestedSlot, "Approved");

            if (pendingApplication != null || approvedApplication != null) {
                // Eğer "Pending" veya "Approved" bir başvuru varsa, bu slotu koruyun ve diğer tercihlere geçin
                continue;
            }
            if(conflictingApplication != null){
                // Çatışma varsa, önceliklendirme yap
                SchoolTourApplication prioritizedApplication = prioritizeSchool(application, conflictingApplication);

                if (prioritizedApplication == application) {
                    // Daha düşük öncelikli uygulamayı işleme al
                    handleLessPrioritizedSchool(conflictingApplication, start +1);

                    // Slot'u mevcut uygulamaya ata
                    application.setSelectedDate(requestedDate);
                    application.setSelectedTimeSlot(requestedSlot);
                    application.setApplicationStatus("Pending");
                    return;
                }
                else{
                    // Eğer çakışma yaşayan başvuru daha yüksek öncelikliyse, mevcut başvuru için diğer tercihlere bak
                    continue;
                }
            }
            // Eğer slot boşsa, atama yap
            application.setSelectedDate(requestedDate);
            application.setSelectedTimeSlot(requestedSlot);
            application.setApplicationStatus("Pending");
            return; // Başarılı bir şekilde atandı

        }
        // Eğer hiçbir slot atanamadıysa, başvuruyu "Pre-rejected" olarak işaretle
        application.setApplicationStatus("Pre-rejected");
    }


    /**
     * Processes all individual tour applications to assign slots based on prioritization rules.
     *
     * Preconditions:
     * - The repository must contain valid `IndividualTourApplication` entities.
     * - The entities should have a status of "Created" and a valid `transitionTime`.
     *
     * Postconditions:
     * - Conflicting or duplicate applications are marked as "Pre-rejected".
     * - Unique applications are sorted by priority and processed for slot assignment.
     * - If no slot is assigned, the application is marked "Pre-rejected".
     * - If a slot is successfully assigned, the application is marked "Pending".
     */
    @Transactional
    public void processIndividualTourApplications() {
        LocalDateTime now = LocalDateTime.now(); // Şu anki zaman

        // Basit query ile başvuruları al
        List<IndividualTourApplication> applications = individualTourApplicationRepos.findIndByStatusAndTransitionTime("Created", now);

        // Benzersiz ve tekrarlı başvuruları oluşturmak için Map
        Map<String, IndividualTourApplication> uniqueApplicationsMap = new HashMap<>();
        List<IndividualTourApplication> nonUniqueApplications = new ArrayList<>();

        for (IndividualTourApplication application : applications) {
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
        List<IndividualTourApplication> uniqueApplications = new ArrayList<>(uniqueApplicationsMap.values());

        // Unique başvuruları log'a yaz
        for (IndividualTourApplication application : uniqueApplications) {
            System.out.println("Unique application: " + application.getSelectedDate() + " | " + application.getApplicationStatus());
        }

        // Non-unique başvuruları sil
        for (IndividualTourApplication application : nonUniqueApplications) {
            System.out.println("Deleting non-unique application: " + application.getId());
            application.setApplicationStatus("Pre-rejected");
        }
        System.out.println("Deleted " + nonUniqueApplications.size() + " non-unique applications.");


        List<IndividualTourApplication> sortedApplications = uniqueApplications.stream()
                .sorted(Comparator.comparingInt((IndividualTourApplication app) -> app.getApplyingHighschool().getPriorityPoint())
                        .reversed() // Büyükten küçüğe sıralama
                        .thenComparing((IndividualTourApplication app) ->
                                app.getApplyingHighschool().getCity().equalsIgnoreCase("Ankara") ? 1 : 0) // Ankara olmayanlar öncelikli
                        .thenComparing(IndividualTourApplication::getApplicationTime)) // Başvuru zamanına göre artan sıralama
                .toList();

        // İşlenmiş başvuruları sırayla işle
        for (IndividualTourApplication application : sortedApplications) {
            boolean assigned = assignSlotWithPrioritizationInd(application);

            if (!assigned) {
                // Eğer slot atanamadıysa, durumu "Pre-rejected" olarak ayarla
                application.setApplicationStatus("Pre-rejected");
            } else {
                // Slot atandıysa, durumu "Pending" olarak ayarla
                application.setApplicationStatus("Pending");
                tourController.createIndividualTour(application.getId());
            }

            // Güncellenen başvuru durumunu kaydet
            individualTourApplicationRepos.save(application);
        }
    }

    /**
     * Başvuruyu istenen bir slot'a atamayı dener.
     */

    /**
     * Attempts to assign a slot to an individual tour application based on prioritization.
     *
     * Preconditions:
     * - The application must not be null.
     * - The application must have valid `requestedDates`.
     *
     * Postconditions:
     * - Assigns a slot and updates the application status to "Pending" if successful.
     * - Returns false if no slot is available.
     *
     * @param application The individual tour application.
     * @return True if a slot was successfully assigned, false otherwise.
     */
    private boolean assignSlotWithPrioritizationInd(IndividualTourApplication application) {
        for (RequestedDateTime requestedDateTime : application.getRequestedDates()) {
            LocalDate requestedDate = requestedDateTime.getDate();
            TimeSlot requestedSlot = requestedDateTime.getTimeSlot();

            // Aynı tarih ve zaman diliminde başka bir "Created" başvuru var mı kontrol et
            if(requestedDate == null || requestedSlot == null) {
                return false;
            }

            IndividualTourApplication conflictingApplication = individualTourApplicationRepos.findIndBySelectedDateAndSelectedTimeSlotAndStatus
                    (requestedDate, requestedSlot, "Created");

            IndividualTourApplication pendingApplication = individualTourApplicationRepos.findIndBySelectedDateAndSelectedTimeSlotAndStatus(requestedDate, requestedSlot, "Pending");

            IndividualTourApplication approvedApplication = individualTourApplicationRepos.findIndBySelectedDateAndSelectedTimeSlotAndStatus(requestedDate, requestedSlot, "Approved");

            // Eğer "Pending" veya "Approved" varsa, bu slotu koru ve diğer tercihe geç
            if (pendingApplication != null || approvedApplication != null) {
                continue;
            }

            if (conflictingApplication != null) {
                // Çakışma varsa önceliklendirme yap
                IndividualTourApplication prioritizedApplication = prioritizeSchoolInd(application, conflictingApplication);

                if (prioritizedApplication == application) {
                    handleLessPrioritizedSchoolInd(conflictingApplication, 1);

                    application.setSelectedDate(requestedDate);
                    application.setSelectedTimeSlot(requestedSlot);
                    application.setApplicationStatus("Pending");
                    return true;
                } else {
                    continue;
                }
            }

            // Eğer çakışma yoksa slot'u atayın
            application.setSelectedDate(requestedDate);
            application.setSelectedTimeSlot(requestedSlot);
            application.setApplicationStatus("Pending");
            return true;
        }

        // Eğer hiçbir slot atanamadıysa, false döndür
        return false;
    }

    /**
     * İki başvuru arasından önceliklendirme yapar.
     */

    /**
     * Handles the prioritization of conflicting individual applications.
     *
     * Preconditions:
     * - Both applications must not be null.
     * - Both applications must belong to valid high schools.
     *
     * Postconditions:
     * - Returns the application with higher priority based on school priority points.
     *
     * @param app1 The first individual application.
     * @param app2 The second individual application.
     * @return The prioritized individual application.
     */
    private IndividualTourApplication prioritizeSchoolInd(IndividualTourApplication app1, IndividualTourApplication app2) {
        HighSchool highSchool1 = app1.getApplyingHighschool();
        HighSchool highSchool2 = app2.getApplyingHighschool();

        int priority1 = highSchool1.getPriorityPoint();
        int priority2 = highSchool2.getPriorityPoint();

        // priorityPoint'e göre karşılaştırma
        if (priority1 != priority2) {
            return (priority1 > priority2) ? app1 : app2;
        }

        if(highSchool1.getSchoolName().equalsIgnoreCase("Ankara") && !highSchool2.getSchoolName().equalsIgnoreCase("Ankara")) {
            return app2;
        }
        else if(!highSchool1.getSchoolName().equalsIgnoreCase("Ankara") && highSchool2.getSchoolName().equalsIgnoreCase("Ankara")){
            return app1;
        }
        else{// if both are from Ankara or both from outside of Ankara
            // daha erken başvuru yapanı önceliklendir
            LocalDateTime applicationTime1 = app1.getApplicationTime();
            LocalDateTime applicationTime2 = app2.getApplicationTime();

            return (applicationTime1.isBefore(applicationTime2)) ? app1 : app2;
        }
    }

    /**
     * Daha düşük öncelikli okulu bir sonraki uygun slot'a atar.
     */

    /**
     * Attempts to assign a slot to a less prioritized individual application for the next available preference.
     *
     * Preconditions:
     * - The application must not be null.
     * - The application must have valid `requestedDates` starting from the given index.
     *
     * Postconditions:
     * - If a slot is assigned, the application status is updated to "Pending".
     * - If no slot is available after iterating preferences, the application is marked "Pre-rejected".
     *
     * @param application The individual tour application to handle.
     * @param start The starting index for checking preferences in the requested dates.
     */
    private void handleLessPrioritizedSchoolInd(IndividualTourApplication application, int start) {
        if(start >= application.getRequestedDates().size()){
            // Eğer hiçbir slot atanamadıysa, başvuruyu "Pre-rejected" olarak işaretle
            application.setApplicationStatus("Pre-rejected");
            return;
        }
        List<RequestedDateTime> remainingPreferences = application.getRequestedDates().subList(start, application.getRequestedDates().size());

        for (RequestedDateTime requestedDateTime : remainingPreferences) {
            LocalDate requestedDate = requestedDateTime.getDate();
            TimeSlot requestedSlot = requestedDateTime.getTimeSlot();

            if (requestedDate == null || requestedSlot == null) {
                continue; // Geçersiz tercihleri atla
            }

            // Aynı tarih ve zaman diliminde başka bir başvuru var mı kontrol et
            IndividualTourApplication conflictingApplication = individualTourApplicationRepos.findIndBySelectedDateAndSelectedTimeSlotAndStatus
                    (requestedDate, requestedSlot, "Created");
            IndividualTourApplication pendingApplication = individualTourApplicationRepos.findIndBySelectedDateAndSelectedTimeSlotAndStatus
                    (requestedDate, requestedSlot, "Pending");
            IndividualTourApplication approvedApplication = individualTourApplicationRepos.findIndBySelectedDateAndSelectedTimeSlotAndStatus
                    (requestedDate, requestedSlot, "Approved");

            if (pendingApplication != null || approvedApplication != null) {
                // Eğer "Pending" veya "Approved" bir başvuru varsa, bu slotu koruyun ve diğer tercihlere geçin
                continue;
            }
            if(conflictingApplication != null){
                // Çatışma varsa, önceliklendirme yap
                IndividualTourApplication prioritizedApplication = prioritizeSchoolInd(application, conflictingApplication);

                if (prioritizedApplication == application) {
                    // Daha düşük öncelikli uygulamayı işleme al
                    handleLessPrioritizedSchoolInd(conflictingApplication, start +1);

                    // Slot'u mevcut uygulamaya ata
                    application.setSelectedDate(requestedDate);
                    application.setSelectedTimeSlot(requestedSlot);
                    application.setApplicationStatus("Pending");
                    return;
                }
                else{
                    // Eğer çakışma yaşayan başvuru daha yüksek öncelikliyse, mevcut başvuru için diğer tercihlere bak
                    continue;
                }
            }
            // Eğer slot boşsa, atama yap
            application.setSelectedDate(requestedDate);
            application.setSelectedTimeSlot(requestedSlot);
            application.setApplicationStatus("Pending");
            return; // Başarılı bir şekilde atandı

        }
        // Eğer hiçbir slot atanamadıysa, başvuruyu "Pre-rejected" olarak işaretle
        application.setApplicationStatus("Pre-rejected");
    }


}
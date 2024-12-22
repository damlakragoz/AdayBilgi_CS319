
package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Controller.TourController;
import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Repos.CounselorRepos;
import com.CS319.BTO_Application.Repos.SchoolTourApplicationRepos;
import com.CS319.BTO_Application.Repos.TourApplicationRepos;
import com.CS319.BTO_Application.Repos.UserRepos;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SchoolTourApplicationService {
    private final SchoolTourApplicationRepos schoolTourApplicationRepos;
    private final UserRepos userRepos;
    private final CounselorRepos counselorRepos;
    private final TourApplicationRepos tourApplicationRepos;


    @Autowired
    public SchoolTourApplicationService(SchoolTourApplicationRepos schoolTourApplicationRepos, UserRepos userRepos, CounselorRepos counselorRepos, @Qualifier("tourApplicationRepos") TourApplicationRepos tourApplicationRepos) {
        this.schoolTourApplicationRepos = schoolTourApplicationRepos;
        this.userRepos = userRepos;
        this.counselorRepos = counselorRepos;
        this.tourApplicationRepos = tourApplicationRepos;
    }

    /**
     * Adds a new school tour application and associates it with a counselor and high school.
     *
     * Preconditions:
     * - A valid counselor email must be provided.
     * - The counselor associated with the email must exist.
     *
     * Postconditions:
     * - The school tour application is saved with a status of "Created".
     * - The transition time is set to the nearest batch processing window.
     *
     * @param schoolTourApplication The school tour application to be added.
     * @param counselorEmail The email of the counselor submitting the application.
     * @return The saved `SchoolTourApplication` entity.
     */
    public SchoolTourApplication addSchoolApplication(SchoolTourApplication schoolTourApplication, String counselorEmail) {
        Counselor counselor = (Counselor)userRepos.findByEmail(counselorEmail);
        schoolTourApplication.setApplyingCounselor(counselor);
        schoolTourApplication.setApplyingHighschool(counselor.getHighSchool());

        schoolTourApplication.setApplicationStatus("Created");

        // Şu anki zamanı al
        LocalDateTime now = LocalDateTime.now();

        // İşlem penceresini 2 dakika sonrası olarak ayarla
        LocalDateTime batchWindow = now.withSecond(0).withNano(0).plusMinutes(1);

        /*

        // Bir sonraki işlem penceresini belirle (ör. 23:59 bugünün sonu)
        LocalDateTime batchWindow = now.withHour(23).withMinute(59).withSecond(0);

        // Eğer şu anki zaman işleme penceresinden sonra ise, bir sonraki güne ayarla
        if (now.isAfter(batchWindow)) {
            batchWindow = batchWindow.plusDays(1);
        }

         */

        schoolTourApplication.setTransitionTime(batchWindow);
        schoolTourApplication.setApplicationTime(now);

        return schoolTourApplicationRepos.save(schoolTourApplication);
    }

    /**
     * Retrieves all school tour applications.
     *
     * Postconditions:
     * - A list of all school tour applications is returned.
     *
     * @return A list of `SchoolTourApplication` entities.
     */
    public List<SchoolTourApplication> getAllSchoolTourApplications() {
        return schoolTourApplicationRepos.findAll();
    }

    /**
     * Retrieves all school tour applications submitted by a specific counselor.
     *
     * Preconditions:
     * - The provided counselor must not be null.
     *
     * Postconditions:
     * - A list of school tour applications associated with the counselor is returned.
     *
     * @param counselor The counselor whose applications are to be retrieved.
     * @return A list of `SchoolTourApplication` entities.
     */
    public List<SchoolTourApplication> getAllSchoolTourApplicationsByCounselor(Counselor counselor) {
        return schoolTourApplicationRepos.findByApplyingCounselor(counselor);
    }

    /**
     * Retrieves a school tour application by its ID.
     *
     * Preconditions:
     * - A valid application ID must be provided.
     *
     * Postconditions:
     * - If the application exists, it is returned.
     * - If the application does not exist, an `EntityNotFoundException` is thrown.
     *
     * @param tourApplicationId The ID of the school tour application to retrieve.
     * @return The `SchoolTourApplication` entity.
     */
    public SchoolTourApplication getSchoolTourApplicationById(Long tourApplicationId) {
        return schoolTourApplicationRepos.findById(tourApplicationId)
                .orElseThrow(() -> new EntityNotFoundException("SchoolTourApplication not found with id: " + tourApplicationId));
    }

    /**
     * Deletes a school tour application by its ID.
     *
     * Preconditions:
     * - The application with the specified ID must exist.
     *
     * Postconditions:
     * - The application is deleted if it exists.
     * - If the application does not exist, no action is performed, and a message is logged.
     *
     * @param schoolTourApplicationId The ID of the application to delete.
     */
    public void deleteSchoolTourApplicationById(Long schoolTourApplicationId) {
        if(schoolTourApplicationRepos.existsById(schoolTourApplicationId)) {
            schoolTourApplicationRepos.deleteById(schoolTourApplicationId);
        }
        else{
            System.out.println("School Tour Application Not Found");
        }
    }

    /**
     * Cancels a school tour application submitted by a counselor.
     *
     * Preconditions:
     * - The counselor email must be valid and correspond to an existing counselor.
     * - The school tour application ID must correspond to an existing application.
     *
     * Postconditions:
     * - The status of the application is updated to "Cancelled".
     * - The updated application is returned.
     *
     * @param counselorEmail The email of the counselor.
     * @param schoolTourApplicationId The ID of the school tour application to cancel.
     * @return The updated `SchoolTourApplication` entity.
     */
    public SchoolTourApplication cancelSchoolTourApplication(String counselorEmail, Long schoolTourApplicationId) {
        if(!counselorRepos.existsByEmail(counselorEmail)){
            throw new EntityNotFoundException("Counselor not found with email: " + counselorEmail);
        }
        if(!schoolTourApplicationRepos.existsById(schoolTourApplicationId)) {
            System.out.println("School Tour Application Not Found");
        }
        SchoolTourApplication tourApplication = getSchoolTourApplicationById(schoolTourApplicationId);
        tourApplication.setApplicationStatus("Cancelled");
        schoolTourApplicationRepos.save(tourApplication);
        return tourApplication;
    }

    /**
     * Checks if a school tour application already exists for a given high school and date.
     *
     * Preconditions:
     * - The counselor email must be valid and correspond to an existing counselor.
     *
     * Postconditions:
     * - Returns true if an application with a conflicting date and status exists.
     * - Returns false otherwise.
     *
     * @param schoolTourApplication The school tour application to check for conflicts.
     * @param counselorEmail The email of the counselor.
     * @return True if a conflicting application exists, false otherwise.
     */
    public boolean existsSchoolTourApplicationByHighSchoolAndDate(SchoolTourApplication schoolTourApplication, String counselorEmail) {
        if(!counselorRepos.existsByEmail(counselorEmail)){
            return false;
        }
        Counselor counselor  = counselorRepos.findByEmail(counselorEmail);
        HighSchool applyingHighSchool = counselor.getHighSchool();
        for(RequestedDateTime requestedDateTime: schoolTourApplication.getRequestedDates()){
            LocalDate requestedDate = requestedDateTime.getDate();
            if(schoolTourApplicationRepos.existsBySelectedDateAndApplyingHighschoolAndApplicationStatus
                    (requestedDate,applyingHighSchool,"Pending")
                    || schoolTourApplicationRepos.existsBySelectedDateAndApplyingHighschoolAndApplicationStatus
                    (requestedDate,applyingHighSchool,"Approved")
            ){
                return true;
            }
        }
        return false;
    }
}



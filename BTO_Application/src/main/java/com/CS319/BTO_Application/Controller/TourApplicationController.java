
package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.AddIndividualApplicationRequest;
import com.CS319.BTO_Application.DTO.AddSchoolApplicationRequest;
import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/tour-applications")
@Controller
public class TourApplicationController {

    private final SchoolTourApplicationService schoolTourApplicationService;
    private final IndividualTourApplicationService individualTourApplicationService;
    private final CounselorService counselorService;
    private final HighSchoolService highSchoolService;
    private final TourApplicationService tourApplicationService;
    private final TourService tourService;
    private final NotificationService notificationService;
    //there will be logic for individual tourapplciation also

    @Autowired
    public TourApplicationController(SchoolTourApplicationService schoolTourApplicationService, IndividualTourApplicationService individualTourApplicationService,
                                     CounselorService counselorService, HighSchoolService highSchoolService, TourApplicationService tourApplicationService,
                                     TourService tourService, NotificationService notificationService) {
        this.schoolTourApplicationService = schoolTourApplicationService;
        this.individualTourApplicationService = individualTourApplicationService;
        this.counselorService = counselorService;
        this.highSchoolService = highSchoolService;
        this.tourApplicationService = tourApplicationService;
        this.tourService = tourService;
        this.notificationService = notificationService;
    }


    /**
     * Fetches all tour applications.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a ResponseEntity containing a list of all tour applications.
     * - If an error occurs, returns a ResponseEntity with status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing all tour applications or an error message.
     */
    @GetMapping("/getAll")
    public ResponseEntity<?> getAllTourApplications() {
        try {
            // Fetch all counselors from the service
            List<TourApplication> tourApplications = tourApplicationService.getAllTourApplications();
            return ResponseEntity.ok(tourApplications); // Return the list of counselors with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour applications.");
        }
    }
////////////////////////////
// SchoolTourApplication Methods START

    /**
     * Fetches all school tour applications.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a ResponseEntity containing a list of all school tour applications.
     * - If an error occurs, returns a ResponseEntity with status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing all school tour applications or an error message.
     */
    @GetMapping("/getAll/school-applications")
    public ResponseEntity<?> getAllSchoolTourApplications() {
        try {
            // Fetch all tour guides from the service
            List<SchoolTourApplication> tourApplications = schoolTourApplicationService.getAllSchoolTourApplications();
            return ResponseEntity.ok(tourApplications); // Return the list of tour guides with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour applications.");
        }
    }

    /**
     * Adds a new school tour application.
     *
     * Preconditions:
     * - `applicationRequest` must not be null.
     * - `applicationRequest.counselorUsername` must correspond to an existing counselor.
     * - There should not be a conflicting tour application for the same high school and date.
     *
     * Postconditions:
     * - Creates and returns the new SchoolTourApplication with status 201 (CREATED).
     * - If the counselor does not exist, returns status 404 (NOT_FOUND).
     * - If there is a conflict, returns status 409 (CONFLICT).
     *
     * @param applicationRequest Request containing the details of the school tour application.
     * @return ResponseEntity with the created application or error status.
     */
    @PostMapping("/add/school-application")
    public ResponseEntity<SchoolTourApplication> addSchoolApplication(@RequestBody AddSchoolApplicationRequest applicationRequest) {
        if(counselorService.getCounselorByUsername(applicationRequest.getCounselorUsername()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by username

        if(schoolTourApplicationService.existsSchoolTourApplicationByHighSchoolAndDate(applicationRequest.getTourApplication(), applicationRequest.getCounselorUsername())){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(schoolTourApplicationService.addSchoolApplication(applicationRequest.getTourApplication(),applicationRequest.getCounselorUsername()), HttpStatus.CREATED);
    }

    /**
     * Deletes a school tour application by ID.
     *
     * Preconditions:
     * - `tourApplicationId` must correspond to an existing SchoolTourApplication.
     *
     * Postconditions:
     * - Deletes the specified SchoolTourApplication.
     * - Returns status 204 (NO_CONTENT).
     *
     * @param tourApplicationId ID of the SchoolTourApplication to delete.
     * @return ResponseEntity with status 204 or error status.
     */
    @DeleteMapping("/delete/school-application")
    public ResponseEntity<SchoolTourApplication> deleteSchoolApplication(@RequestParam Long tourApplicationId) {
        schoolTourApplicationService.deleteSchoolTourApplicationById(tourApplicationId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
////////////////////////////
// SchoolTourApplication Methods END

    ////////////////////////////
// IndividualTourApplication Methods START

    /**
     * Fetches all individual tour applications.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a ResponseEntity containing a list of all individual tour applications.
     * - If an error occurs, returns a ResponseEntity with status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing all individual tour applications or an error message.
     */
    @GetMapping("/getAll/individual-applications")
    public ResponseEntity<?> getAllIndividualTourApplications() {
        try {
            // Fetch all tour guides from the service
            List<IndividualTourApplication> tourApplications = individualTourApplicationService.getAllIndividualTourApplications();
            return ResponseEntity.ok(tourApplications); // Return the list of tour guides with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour applications.");
        }
    }

    /**
     * Adds a new individual tour application.
     *
     * Preconditions:
     * - `applicationRequest` must not be null.
     * - `applicationRequest.schoolName` must correspond to an existing high school.
     *
     * Postconditions:
     * - Creates and returns the new IndividualTourApplication with status 201 (CREATED).
     * - If the high school does not exist, returns status 404 (NOT_FOUND).
     *
     * @param applicationRequest Request containing the details of the individual tour application.
     * @return ResponseEntity with the created application or error status.
     */
    @PostMapping("/add/individual-application")
    public ResponseEntity<?> addIndividualApplication(@RequestBody AddIndividualApplicationRequest applicationRequest) {
        System.out.println("Received Application: " + applicationRequest);
        HighSchool highSchool = highSchoolService.getSchoolByName(applicationRequest.getSchoolName());
        if (highSchool == null) {
            return new ResponseEntity<>("High school not found", HttpStatus.NOT_FOUND);
        }

        IndividualTourApplication tourApplication = applicationRequest.getIndividualTourApplication();
        tourApplication.setApplyingHighschool(highSchool);
        tourApplication.setRequestedDates(applicationRequest.getRequestedDates()); // Set requestedDates here

        IndividualTourApplication savedApplication = individualTourApplicationService.addIndividualApplication(tourApplication);

        return new ResponseEntity<>(savedApplication, HttpStatus.CREATED);
    }

    /**
     * Deletes an individual tour application by ID.
     *
     * Preconditions:
     * - `tourApplicationId` must correspond to an existing IndividualTourApplication.
     *
     * Postconditions:
     * - Deletes the specified IndividualTourApplication.
     * - Returns status 204 (NO_CONTENT).
     *
     * @param tourApplicationId ID of the IndividualTourApplication to delete.
     * @return ResponseEntity with status 204 or error status.
     */
    @DeleteMapping("delete/individual-application")
    public ResponseEntity<?> deleteIndividualApplication(@RequestParam Long tourApplicationId) {
        individualTourApplicationService.deleteIndividualTourApplicationById(tourApplicationId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Cancels a school tour application by the counselor.
     *
     * Preconditions:
     * - `counselorEmail` must correspond to an existing counselor.
     * - `tourApplicationId` must correspond to an existing SchoolTourApplication.
     * - The application must belong to the specified counselor.
     *
     * Postconditions:
     * - Cancels the specified SchoolTourApplication.
     * - Updates related notifications.
     * - Returns status 202 (ACCEPTED) if successful.
     *
     * @param counselorEmail Email of the counselor requesting cancellation.
     * @param tourApplicationId ID of the SchoolTourApplication to cancel.
     * @return ResponseEntity with the updated application or error status.
     */
    @PostMapping("/counselor/cancel")
    public ResponseEntity<SchoolTourApplication> cancelSchoolTourApplication(@RequestParam String counselorEmail,@RequestParam Long tourApplicationId) {
        SchoolTourApplication schoolTourApplication = schoolTourApplicationService.getSchoolTourApplicationById(tourApplicationId);
        if(counselorService.getCounselorByUsername(counselorEmail) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        Counselor counselor = counselorService.getCounselorByUsername(counselorEmail);
        if(schoolTourApplication.getApplyingCounselor().equals(counselor)){
            // Notification Logic
            Tour tour = tourService.getTourByApplicationId(tourApplicationId);
            if(tour != null){
                notifyForTourApplication(tour, tour.getAssignedGuideEmail(), "Guide Cancellation");
                tourService.cancelTourByCounselor(tourApplicationId);
            }
            return new ResponseEntity<>(schoolTourApplicationService.cancelSchoolTourApplication(counselorEmail, tourApplicationId), HttpStatus.ACCEPTED);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Sends a notification for a specific tour application.
     *
     * Preconditions:
     * - `tour` must not be null.
     * - `email` must be a valid email address.
     * - `situation` must be a recognized scenario for generating notifications.
     *
     * Postconditions:
     * - A notification is created and sent to the specified email address.
     *
     * @param tour The tour associated with the notification.
     * @param email The email address to which the notification will be sent.
     * @param situation The scenario that determines the notification's content.
     */
    private void notifyForTourApplication(Tour tour, String email, String situation) {
        String title = null;
        String text = null;
        if (situation.equals("Counselor Cancellation")) {
            title = "Onaylanan Üniversite Turunuzu İptal Ettiniz";
            text = "İptal Edilen Turun Bilgisi: <br>" +
                    "Tarih: " + tour.getChosenDate() +"<br>" +
                    "Saat: " + tour.getChosenTimeSlot().getDisplayName();
        }
        else if (situation.equals("Guide Cancellation")) {
            title = "Onaylanan Turunuz Lise Tarafından İptal Edildi";
            text = "Tur Bilgisi: <br>" +
                    "Tarih: " + tour.getChosenDate() +"<br>" +
                    "Saat: " + tour.getChosenTimeSlot().getDisplayName() +"<br>" +
                    "Lise: " + tour.getApplyingHighschool().getSchoolName() +"<br>" +
                    "Ziyaretçi Sayısı: " + tour.getVisitorCount();
        }

        if (title != null || text != null) {
            notificationService.createNotification(email, title, text);
        }
    }
    ////////////////////////////
// IndividualTourApplication Methods END


}


package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.*;
import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Repos.FairRepos;
import com.CS319.BTO_Application.Service.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RequestMapping("api/fair")
@Controller
public class FairController {

    private final FairService fairService;
    private final FairInvitationService fairInvitationService;
    private final TourGuideService tourGuideService;
    private final CoordinatorService coordinatorService;
    private final ExecutiveService executiveService;
    private final PaymentController paymentController;
    private final FairRepos fairRepos;
    private final CounselorService counselorService;
    private final NotificationService notificationService;

    @Autowired
    public FairController(FairService fairService, FairInvitationService fairInvitationService, TourGuideService tourGuideService, CoordinatorService coordinatorService, ExecutiveService executiveService, PaymentController paymentController, FairRepos fairRepos, CounselorService counselorService, NotificationService notificationService) {
        this.fairService = fairService;
        this.fairInvitationService = fairInvitationService;
        this.tourGuideService = tourGuideService;
        this.coordinatorService = coordinatorService;
        this.executiveService = executiveService;
        this.paymentController = paymentController;
        this.fairRepos = fairRepos;
        this.counselorService = counselorService;
        this.notificationService = notificationService;
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<Fair>> getAllFairs() {
        try {
            List<Fair> fairs = fairService.getAllFairs();
            return ResponseEntity.ok(fairs);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    /**
     * Retrieves the assigned guide for a fair.
     *
     * Preconditions:
     * - `fairId` must not be null.
     *
     * Postconditions:
     * - Returns the assigned guide if found.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param fairId The ID of the fair.
     * @return ResponseEntity containing the assigned guide or an error message.
     */
    @GetMapping("/get/assigned-guide")
    public ResponseEntity<?> getAssignedGuideForFair(@RequestParam Long fairId) {
        try {
            // Fetch all tour guides from the service
            Fair fair = fairService.getFairById(fairId);
            TourGuide assignedGuide = fair.getAssignedGuideToFair();
            return ResponseEntity.ok(assignedGuide); // Return the list of tours with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving the assigned guide.");
        }
    }

    /**
     * Retrieves the assigned executive for a fair.
     *
     * Preconditions:
     * - `fairId` must not be null.
     *
     * Postconditions:
     * - Returns the assigned executive if found.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param fairId The ID of the fair.
     * @return ResponseEntity containing the assigned executive or an error message.
     */
    @GetMapping("/get/assigned-executive")
    public ResponseEntity<?> getAssignedExecutiveForFair(@RequestParam Long fairId) {
        try {
            // Fetch all tour guides from the service
            Fair fair = fairService.getFairById(fairId);
            Executive assignedExecutive = fair.getAssignedExecutive();
            return ResponseEntity.ok(assignedExecutive); // Return the list of tours with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving the assigned executive.");
        }
    }

    /**
     * Enrolls a tour guide in a fair.
     *
     * Preconditions:
     * - `fairOperationsForGuide` must not be null.
     * - The tour guide must exist.
     *
     * Postconditions:
     * - The fair status is updated.
     * - Notifications are sent.
     * - Returns status 202 (ACCEPTED) if successful.
     *
     * @param fairOperationsForGuide The operations for the guide.
     * @return ResponseEntity with the updated fair or error status.
     */
    @PostMapping("/guide-enroll")
    public ResponseEntity<Fair> tourGuideEnrollsInFair(@RequestBody FairOperationsForGuide fairOperationsForGuide) {
        Fair fair = fairService.getFairById(fairOperationsForGuide.getFairId());
        if(tourGuideService.getTourGuideByEmail(fairOperationsForGuide.getApplyingGuideEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        if(fair.getFairStatus().equals("Pending")){
            fair.setFairStatus("GuideAssigned");
            fairInvitationService.setStatusApproved(fair.getFairInvitation());

            // Notify Enrolled Guide
            notifyForFair(fair, fairOperationsForGuide.getApplyingGuideEmail(), "Guide Enroll In Fair");
            // Notify Counselor since someone will come to fair
            notifyForFair(fair, fair.getFairInvitation().getApplyingCounselor().getEmail(), "Counselor Fair Approved By Guide");

            return new ResponseEntity<>(fairService.assignFair(fair,
                    fairOperationsForGuide.getApplyingGuideEmail(), null), HttpStatus.ACCEPTED);
        }
        else if (fair.getFairStatus().equals("ExecutiveAssigned")) {
            fair.setFairStatus("ExecutiveAndGuideAssigned");

            // Notify Enrolled Guide
            notifyForFair(fair, fairOperationsForGuide.getApplyingGuideEmail(), "Guide Enroll In Fair");
            // Notify Counselor since someone will come to fair
            notifyForFair(fair, fair.getFairInvitation().getApplyingCounselor().getEmail(), "Counselor Fair Approved By Guide");

            return new ResponseEntity<>(fairService.assignFair(fair,
                    fairOperationsForGuide.getApplyingGuideEmail(), null), HttpStatus.ACCEPTED);
        }
        else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Enrolls an executive in a fair.
     *
     * Preconditions:
     * - `fairOperationsForExecutive` must not be null.
     * - The executive must exist.
     *
     * Postconditions:
     * - The fair status is updated.
     * - Notifications are sent.
     * - Returns status 202 (ACCEPTED) if successful.
     *
     * @param fairOperationsForExecutive The operations for the executive.
     * @return ResponseEntity with the updated fair or error status.
     */
    @PostMapping("/executive-enroll")
    public ResponseEntity<Fair> executiveEnrollsInFair(@RequestBody FairOperationsForExecutive fairOperationsForExecutive) {
        Fair fair = fairService.getFairById(fairOperationsForExecutive.getFairId());
        if(executiveService.getExecutiveByEmail(fairOperationsForExecutive.getExecutiveEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        if(fair.getFairStatus().equals("Pending")){
            fair.setFairStatus("ExecutiveAssigned");
            fairInvitationService.setStatusApproved(fair.getFairInvitation());

            // Notify Enrolled Executive
            notifyForFair(fair, fairOperationsForExecutive.getExecutiveEmail(), "Executive Enroll In Fair");
            // Notify Counselor since someone will come to fair
            notifyForFair(fair, fair.getFairInvitation().getApplyingCounselor().getEmail(), "Counselor Fair Approved By Executive");

            return new ResponseEntity<>(fairService.assignFair(fair, null,
                    fairOperationsForExecutive.getExecutiveEmail()), HttpStatus.ACCEPTED);
        }else if (fair.getFairStatus().equals("GuideAssigned")) {
            fair.setFairStatus("ExecutiveAndGuideAssigned");

            // Notificaty Enrolled Executive
            notifyForFair(fair, fairOperationsForExecutive.getExecutiveEmail(), "Executive Enroll In Fair");
            // Notify Counselor since someone will come to fair
            notifyForFair(fair, fair.getFairInvitation().getApplyingCounselor().getEmail(), "Counselor Fair Approved By Executive");

            return new ResponseEntity<>(fairService.assignFair(fair, null,
                    fairOperationsForExecutive.getExecutiveEmail()), HttpStatus.ACCEPTED);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Submits fair activity as a guide.
     *
     * Preconditions:
     * - `fairId`, `tourGuideEmail`, and `duration` must not be null.
     * - `duration` must be greater than 0.
     *
     * Postconditions:
     * - The fair activity is submitted.
     * - A payment is created for the guide.
     * - Returns status 201 (CREATED) if successful.
     *
     * @param fairId The ID of the fair.
     * @param tourGuideEmail The email of the tour guide.
     * @param duration The duration of the activity.
     * @return ResponseEntity with the updated fair or error status.
     */
    @PostMapping("/submit-fair-activity-guide")
    public ResponseEntity<?> submitFairActivityAsGuide(@RequestParam Long fairId,
                                                       @RequestParam String tourGuideEmail,
                                                       @RequestParam Double duration) {
        try {
            if (fairId == null || tourGuideEmail == null || duration <= 0) {
                return ResponseEntity.badRequest()
                        .body("Invalid input: Fair ID, Tour Guide ID, and duration must be provided, and duration should be greater than 0.");
            }

            System.out.println("Fetching Fair...");
            Fair fair = fairService.getFairById(fairId);

            System.out.println("Fetching Tour Guide...");
            TourGuide tourGuide = tourGuideService.getTourGuideByEmail(tourGuideEmail);

            // Check if tour or tour guide does not exist
            if (fair == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Fair with ID " + fairId + " not found.");
            }
            if (tourGuide == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour Guide with ID " + tourGuideEmail + " not found.");
            }

            // Check if the assigned guide matches
            if (fair.getAssignedGuideEmail() == null || !fair.getAssignedGuideEmail().equals(tourGuide.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Mismatch: The provided Tour Guide is not assigned to this fair.");
            }

            Fair updatedFair = fairService.submitFairActivityAsGuide(fair, duration);
            paymentController.createPaymentForFair(tourGuideEmail, fairId);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(updatedFair);

        } catch (EntityNotFoundException ex) {
            // Log and return specific error if the entity isn't found
            System.err.println("EntityNotFoundException: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Entity not found: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            // Handle invalid arguments
            System.err.println("IllegalArgumentException: " + ex.getMessage());
            return ResponseEntity.badRequest()
                    .body("Invalid input: " + ex.getMessage());
        } catch (Exception ex) {
            // General exception handling
            System.err.println("Exception: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + ex.getMessage());
        }
    }

    /**
     * Edits fair activity as a guide.
     *
     * Preconditions:
     * - `fairId`, `tourGuideEmail`, and `duration` must not be null.
     * - `duration` must be greater than 0.
     *
     * Postconditions:
     * - The fair activity is edited.
     * - A payment is created for the guide.
     * - Returns status 201 (CREATED) if successful.
     *
     * @param fairId The ID of the fair.
     * @param tourGuideEmail The email of the tour guide.
     * @param duration The duration of the activity.
     * @return ResponseEntity with the updated fair or error status.
     */
    @PostMapping("/edit-fair-activity-guide")
    public ResponseEntity<?> editFairActivityAsGuide(@RequestParam Long fairId,
                                              @RequestParam String tourGuideEmail,
                                              @RequestParam Double duration) {
        try {
            if (fairId == null || tourGuideEmail == null || duration <= 0) {
                return ResponseEntity.badRequest()
                        .body("Invalid input: Tour ID, Tour Guide ID, and duration must be provided, and duration should be greater than 0.");
            }
            Fair fair = fairService.getFairById(fairId);
            TourGuide tourGuide = tourGuideService.getTourGuideByEmail(tourGuideEmail);

            // Check if tour or tour guide does not exist
            if (fair == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour with ID " + fairId + " not found.");
            }
            if (tourGuide == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour Guide with ID " + tourGuideEmail + " not found.");
            }

            // Check if the assigned guide matches
            if (fair.getAssignedGuideEmail() == null || !fair.getAssignedGuideEmail().equals(tourGuide.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Bu fuar bu rehbere atanmamış!.");
            }

            Fair updatedFair = fairService.editFairActivityAsGuide(fair, duration);
            paymentController.createPaymentForTour(tourGuideEmail, fairId);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(updatedFair);

        } catch (EntityNotFoundException ex) {
            // Log and return specific error if the entity isn't found
            System.err.println("EntityNotFoundException: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Entity not found: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            // Handle invalid arguments
            System.err.println("IllegalArgumentException: " + ex.getMessage());
            return ResponseEntity.badRequest()
                    .body("Invalid input: " + ex.getMessage());
        } catch (Exception ex) {
            // General exception handling
            System.err.println("Exception: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + ex.getMessage());
        }
    }

    /**
     * Submits fair activity as an executive.
     *
     * Preconditions:
     * - `fairId`, `executiveEmail`, and `duration` must not be null.
     * - `duration` must be greater than 0.
     *
     * Postconditions:
     * - The fair activity is submitted.
     * - Returns status 201 (CREATED) if successful.
     *
     * @param fairId The ID of the fair.
     * @param executiveEmail The email of the executive.
     * @param duration The duration of the activity.
     * @return ResponseEntity with the updated fair or error status.
     */
    @PostMapping("/submit-fair-activity-executive")
    public ResponseEntity<?> submitFairActivityAsExecutive(@RequestParam Long fairId,
                                                       @RequestParam String executiveEmail,
                                                       @RequestParam Double duration) {

        try {
            if (fairId == null || executiveEmail == null || duration <= 0) {
                return ResponseEntity.badRequest()
                        .body("Invalid input: Fair ID, Executive ID, and duration must be provided, and duration should be greater than 0.");
            }

            System.out.println("Fetching Fair...");
            Fair fair = fairService.getFairById(fairId);

            System.out.println("Fetching Tour Guide...");
            Executive executive = executiveService.getExecutiveByEmail(executiveEmail);

            // Check if tour or tour guide does not exist
            if (fair == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Fair with ID " + fairId + " not found.");
            }
            if (executive == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Executive with ID " + executive + " not found.");
            }

            // Check if the assigned executive matches
            if (fair.getAssignedExecutiveEmail() == null || !fair.getAssignedExecutiveEmail().equals(executive.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Mismatch: The provided Executive is not assigned to this fair.");
            }

            if(fair.getAssignedGuideToFair() != null){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Eğer fuara rehber atanmış ise fuarın aktivite girişi rehber tarafından yapılmalıdır!");
            }
            Fair updatedFair = fairService.submitFairActivityAsExecutive(fair, duration);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(updatedFair);

        } catch (EntityNotFoundException ex) {
            // Log and return specific error if the entity isn't found
            System.err.println("EntityNotFoundException: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Entity not found: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            // Handle invalid arguments
            System.err.println("IllegalArgumentException: " + ex.getMessage());
            return ResponseEntity.badRequest()
                    .body("Invalid input: " + ex.getMessage());
        } catch (Exception ex) {
            // General exception handling
            System.err.println("Exception: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + ex.getMessage());
        }
    }

    /**
     * Edits fair activity as an executive.
     *
     * Preconditions:
     * - `fairId`, `executiveEmail`, and `duration` must not be null.
     * - `duration` must be greater than 0.
     *
     * Postconditions:
     * - The fair activity is edited.
     * - Returns status 201 (CREATED) if successful.
     *
     * @param fairId The ID of the fair.
     * @param executiveEmail The email of the executive.
     * @param duration The duration of the activity.
     * @return ResponseEntity with the updated fair or error status.
     */
    @PostMapping("/edit-fair-activity-executive")
    public ResponseEntity<?> editFairActivityAsExecutive(@RequestParam Long fairId,
                                                           @RequestParam String executiveEmail,
                                                           @RequestParam Double duration) {

        try {
            if (fairId == null || executiveEmail == null || duration <= 0) {
                return ResponseEntity.badRequest()
                        .body("Invalid input: Fair ID, Executive ID, and duration must be provided, and duration should be greater than 0.");
            }

            System.out.println("Fetching Fair...");
            Fair fair = fairService.getFairById(fairId);

            System.out.println("Fetching Tour Guide...");
            Executive executive = executiveService.getExecutiveByEmail(executiveEmail);

            // Check if tour or tour guide does not exist
            if (fair == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Fair with ID " + fairId + " not found.");
            }
            if (executive == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Executive with ID " + executive + " not found.");
            }

            // Check if the assigned executive matches
            if (fair.getAssignedExecutiveEmail() == null || !fair.getAssignedExecutiveEmail().equals(executive.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Mismatch: The provided Executive is not assigned to this fair.");
            }

            if(fair.getAssignedGuideToFair() != null){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Eğer fuara rehber atanmış ise fuarın aktivite editi rehber tarafından yapılmalıdır!");
            }
            Fair updatedFair = fairService.editFairActivityAsExecutive(fair, duration);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(updatedFair);

        } catch (EntityNotFoundException ex) {
            // Log and return specific error if the entity isn't found
            System.err.println("EntityNotFoundException: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Entity not found: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            // Handle invalid arguments
            System.err.println("IllegalArgumentException: " + ex.getMessage());
            return ResponseEntity.badRequest()
                    .body("Invalid input: " + ex.getMessage());
        } catch (Exception ex) {
            // General exception handling
            System.err.println("Exception: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + ex.getMessage());
        }
    }


    @GetMapping("/by-month")
    public ResponseEntity<List<Fair>> getFairsByMonthAndYear(
            @RequestParam int month,
            @RequestParam int year) {
        List<Fair> fairs = fairService.getFairsByMonthAndYear(month, year);
        return ResponseEntity.ok(fairs);
    }


    @GetMapping("/by-month/finished")
    public ResponseEntity<List<Fair>> getFinishedFairsByMonthAndYear(
            @RequestParam int month,
            @RequestParam int year) {
        List<Fair> finishedFairs = fairService.getFinishedFairsByMonthAndYear(month, year);
        return ResponseEntity.ok(finishedFairs);
    }

    /**
     * Sends notifications related to a fair.
     *
     * Preconditions:
     * - `fair` must not be null and must contain valid details.
     * - `email` must be a valid email address.
     * - `situation` must be a recognized situation type.
     *
     * Postconditions:
     * - Sends a notification to the specified email address.
     * - Generates appropriate notification content based on the situation.
     *
     * @param fair The fair for which the notification is sent.
     * @param email The email address to send the notification.
     * @param situation The situation type that determines the notification content.
     */
    private void notifyForFair(Fair fair, String email, String situation) {
        String title = null;
        String text = null;
        String textForBTOMember = "Başlangıç Zamanı: " + fair.getStartDate() + " - " + fair.getStartTime() + "<br>" +
                "Bitiş Zamanı: " + fair.getEndDate() + " - " + fair.getEndDate() +"<br>" +
                "Lise: " + fair.getApplyingHighschool() +"<br>" +
                "Şehir: " + fair.getApplyingHighschool().getCity();
        String textForCounselor = "Gelecek Kişinin Bilgileri: " + "<br>";


        if (situation.equals("Guide Enroll In Fair") || situation.equals("Executive Enroll In Fair")) {
            title = "Fuara Gitme İsteğiniz Onaylandı";
            text = textForBTOMember;
        }
        else if (situation.equals("Counselor Fair Approved By Guide")) {
            title = "Fuar Davetiyeniz Kabul Edildi";
            textForCounselor += "Ad: " + fair.getAssignedGuideToFair().getFirstName() + "<br>" +
                    "Soyad: " + fair.getAssignedGuideToFair().getLastName() + "<br>" +
                    "Email: " + fair.getAssignedGuideToFair().getEmail() + "<br>" +
                    "Tel: " + fair.getAssignedGuideToFair().getPhoneNumber();
            text = textForCounselor;
        }
        else if (situation.equals("Counselor Fair Approved By Executive")) {
            title = "Fuar Davetiyeniz Kabul Edildi";
            textForCounselor += "Ad: " + fair.getAssignedExecutive().getFirstName() + "<br>" +
                    "Soyad: " + fair.getAssignedExecutive().getLastName() + "<br>" +
                    "Email: " + fair.getAssignedExecutive().getEmail() + "<br>" +
                    "Tel: " + fair.getAssignedExecutive().getPhoneNumber();
            text = textForCounselor;
        }

        if (title != null || text != null || email != null) {
            notificationService.createNotification(email, title, text);
        }
    }
}






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

    @Autowired
    public FairController(FairService fairService, FairInvitationService fairInvitationService, TourGuideService tourGuideService, CoordinatorService coordinatorService, ExecutiveService executiveService, PaymentController paymentController, FairRepos fairRepos, CounselorService counselorService) {
        this.fairService = fairService;
        this.fairInvitationService = fairInvitationService;
        this.tourGuideService = tourGuideService;
        this.coordinatorService = coordinatorService;
        this.executiveService = executiveService;
        this.paymentController = paymentController;
        this.fairRepos = fairRepos;
        this.counselorService = counselorService;
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

    @PostMapping("/guide-enroll")
    public ResponseEntity<Fair> tourGuideEnrollsInFair(@RequestBody FairOperationsForGuide fairOperationsForGuide) {
        Fair fair = fairService.getFairById(fairOperationsForGuide.getFairId());
        if(tourGuideService.getTourGuideByEmail(fairOperationsForGuide.getApplyingGuideEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        if(fair.getFairStatus().equals("Pending")){
            fair.setFairStatus("GuideAssigned");
            fairInvitationService.setStatusApproved(fair.getFairInvitation());
            return new ResponseEntity<>(fairService.assignFair(fair,
                    fairOperationsForGuide.getApplyingGuideEmail(), null), HttpStatus.ACCEPTED);
        }
        else if (fair.getFairStatus().equals("ExecutiveAssigned")) {
            fair.setFairStatus("ExecutiveAndGuideAssigned");
            return new ResponseEntity<>(fairService.assignFair(fair,
                    fairOperationsForGuide.getApplyingGuideEmail(), null), HttpStatus.ACCEPTED);
        }
        else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        }
    }

    @PostMapping("/executive-enroll")
    public ResponseEntity<Fair> executiveEnrollsInFair(@RequestBody FairOperationsForExecutive fairOperationsForExecutive) {
        Fair fair = fairService.getFairById(fairOperationsForExecutive.getFairId());
        if(executiveService.getExecutiveByEmail(fairOperationsForExecutive.getExecutiveEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        if(fair.getFairStatus().equals("Pending")){
            fair.setFairStatus("ExecutiveAssigned");
            fairInvitationService.setStatusApproved(fair.getFairInvitation());
            return new ResponseEntity<>(fairService.assignFair(fair, null,
                    fairOperationsForExecutive.getExecutiveEmail()), HttpStatus.ACCEPTED);
        }else if (fair.getFairStatus().equals("GuideAssigned")) {
            fair.setFairStatus("ExecutiveAndGuideAssigned");
            return new ResponseEntity<>(fairService.assignFair(fair, null,
                    fairOperationsForExecutive.getExecutiveEmail()), HttpStatus.ACCEPTED);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/submit-activity-guide")
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

            Fair updatedFair = fairService.submitFairActivity(fair, duration);
            //paymentController.createPaymentForTour(tourGuideEmail, fairId);

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

    @PostMapping("/submit-activity-executive")
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

            // Check if the assigned guide matches
            if (fair.getAssignedExecutiveEmail() == null || !fair.getAssignedExecutiveEmail().equals(executive.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Mismatch: The provided Executive is not assigned to this fair.");
            }

            Fair updatedFair = fairService.submitFairActivity(fair, duration);
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
}






package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.ApproveRejectTour;
import com.CS319.BTO_Application.DTO.TourOperationsForAdvisor;
import com.CS319.BTO_Application.DTO.TourOperationsForGuide;
import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Service.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@RequestMapping("api/tour")
@Controller
public class TourController {

    private final TourService tourService;
    private final TourGuideService tourGuideService;
    private final CoordinatorService coordinatorService;
    private final SchoolTourApplicationService schoolTourApplicationService;
    private final AdvisorService advisorService;
    private final CounselorService counselorService;
    private final PaymentController paymentController;
    private final IndividualTourApplicationService individualTourApplicationService;
    private final NotificationService notificationService;

    @Autowired
    public TourController(TourService tourAssignmentService, CoordinatorService coordinatorService,
                          TourGuideService tourGuideService, SchoolTourApplicationService schoolTourApplicationService,
                          AdvisorService advisorService, CounselorService counselorService, PaymentController paymentController,
                          IndividualTourApplicationService individualTourApplicationService, NotificationService notificationService){
        this.tourService = tourAssignmentService;
        this.coordinatorService = coordinatorService;
        this.tourGuideService = tourGuideService;
        this.schoolTourApplicationService = schoolTourApplicationService;
        this.advisorService = advisorService;
        this.counselorService = counselorService;
        this.paymentController = paymentController;
        this.individualTourApplicationService = individualTourApplicationService;
        this.notificationService = notificationService;
    }


    /*
        the fields that are the same with Tour instance and TourApplication instance are:
           +visitorCount
           +application.applyingCounselor.getSchool = tour.applyingSchool
           not: tourda ve applciationde ayrı ayrı school ve counselor tutulabilir. Şu anda applicationde counselor turda school tutuluyor
     */
    /**
     * Creates an individual tour based on a tour application.
     *
     * Preconditions:
     * - `tourApplicationId` must correspond to an existing IndividualTourApplication.
     * - The application status must be "Pending".
     *
     * Postconditions:
     * - Creates a new Tour and associates it with the IndividualTourApplication.
     * - Returns status 201 (CREATED) if successful.
     * - Returns status 400 (BAD_REQUEST) if the application status is not "Pending".
     *
     * @param tourApplicationId ID of the IndividualTourApplication.
     * @return ResponseEntity with the created tour or error status.
     */
    @PostMapping("/create/ind")
    public ResponseEntity<Tour> createIndividualTour(@RequestParam Long tourApplicationId) {
        IndividualTourApplication tourApplication = individualTourApplicationService.getIndividualTourApplicationById(tourApplicationId);

        if(!tourApplication.getApplicationStatus().equals("Pending")){// if status not pending
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        System.out.println("BURDA ŞU ANDA");
        // Status = "Pending" which means it passed the scheduling phase and a time and date is assigned
        //otherwise it would be "Pre-rejected"

        LocalDate selectedDate = tourApplication.getSelectedDate();
        TimeSlot selectedTimeSlot = tourApplication.getSelectedTimeSlot();

        Integer visitorCount = tourApplication.getVisitorCount();
        HighSchool applyingSchool = tourApplication.getApplyingHighschool();

        Tour tour = new Tour(visitorCount, selectedTimeSlot, selectedDate,"Pending", applyingSchool, tourApplication, "individual");

        return new ResponseEntity<>(tourService.createIndividualTour(tour, tourApplication), HttpStatus.CREATED);

    }

    /**
     * Creates a school tour based on a tour application.
     *
     * Preconditions:
     * - `tourApplicationId` must correspond to an existing SchoolTourApplication.
     * - The application status must be "Pending".
     *
     * Postconditions:
     * - Creates a new Tour and associates it with the SchoolTourApplication.
     * - Returns status 201 (CREATED) if successful.
     * - Returns status 400 (BAD_REQUEST) if the application status is not "Pending".
     *
     * @param tourApplicationId ID of the SchoolTourApplication.
     * @return ResponseEntity with the created tour or error status.
     */
    @PostMapping("/create/school")
    public ResponseEntity<Tour> createTour(@RequestParam Long tourApplicationId) {
        SchoolTourApplication schoolTourApplication = schoolTourApplicationService.getSchoolTourApplicationById(tourApplicationId);

        if(!schoolTourApplication.getApplicationStatus().equals("Pending")){// if status not pending
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        System.out.println("BURDA ŞU ANDA");
        // Status = "Pending" which means it passed the scheduling phase and a time and date is assigned
        //otherwise it would be "Pre-rejected"

        LocalDate selectedDate = schoolTourApplication.getSelectedDate();
        TimeSlot selectedTimeSlot = schoolTourApplication.getSelectedTimeSlot();

        Integer visitorCount = schoolTourApplication.getVisitorCount();
        HighSchool applyingSchool = schoolTourApplication.getApplyingHighschool();

        Tour tour = new Tour(visitorCount, selectedTimeSlot, selectedDate,"Pending", applyingSchool, schoolTourApplication, "school");

        return new ResponseEntity<>(tourService.createSchoolTour(tour, schoolTourApplication), HttpStatus.CREATED);

    }


    /**
     * Retrieves all tours.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a list of all tours.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing all tours or an error message.
     */
    @GetMapping("/getAll")
    public ResponseEntity<?> getAllTours() {

        try {
            // Fetch all tour guides from the service
            List<Tour> tours = tourService.getAllTours();
            return ResponseEntity.ok(tours); // Return the list of tours with a 200 OK status
        } catch (Exception ex) {
            System.err.println("Error: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tours.");
        }
    }

    /**
     * Retrieves a specific tour by ID.
     *
     * Preconditions:
     * - `tourId` must correspond to an existing tour.
     *
     * Postconditions:
     * - Returns the tour if found.
     * - If the tour does not exist, returns status 404 (NOT_FOUND).
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param tourId ID of the tour to retrieve.
     * @return ResponseEntity containing the tour or an error message.
     */
    @GetMapping("/getById")
    public ResponseEntity<?> getTourById(@RequestParam Long tourId){
        try {
            // Fetch the tour from the service using the provided tourId
            Tour tour = tourService.getTourById(tourId);

            // If tour is found, return it with status 200 (OK)
            if (tour != null) {
                return ResponseEntity.ok(tour); // Return the tour wrapped in ResponseEntity with HTTP status 200
            } else {
                // If no tour is found, return a 404 (Not Found) status
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour with ID " + tourId + " not found.");
            }
        } catch (Exception ex) {
            // If an error occurs, return a 500 (Internal Server Error) status
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving the tour.");
        }
    }

    /**
     * Retrieves the assigned guide for a specific tour.
     *
     * Preconditions:
     * - `tourId` must correspond to an existing tour.
     *
     * Postconditions:
     * - Returns the assigned guide for the specified tour if found.
     * - Returns status 500 (INTERNAL_SERVER_ERROR) if an error occurs.
     *
     * @param tourId The ID of the tour whose assigned guide is to be retrieved.
     * @return ResponseEntity containing the assigned guide or an error message.
     */
    @GetMapping("/get/assignedGuide")
    public ResponseEntity<?> getAssignedGuide(@RequestParam Long tourId) {
        try {
            // Fetch all tour guides from the serviceeyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJCb3JheSIsImlhdCI6MTczNDU2MzY3OSwiZXhwIjoxNzM0NTY3Mjc5fQ.stV5V-4Kp54GSoDt36AF9HRVpTNvbw93wy_TTB8xA_M
            Tour tour = tourService.getTourById(tourId);
            TourGuide assignedGuide = tour.getAssignedGuide();
            return ResponseEntity.ok(assignedGuide); // Return the list of tours with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving the assigned guide.");
        }
    }

    /*
        This method receives coordinator email as a parameter and checks if that coordinator exists
        and if that coordinator exists then changes the status of the tourApplication from "Pending" to "Approved" or "Rejected"
     */
    /**
     * Approves a tour.
     *
     * Preconditions:
     * - `approveRejectTour` must not be null.
     * - `approveRejectTour.getCoordinatorEmail` must correspond to an existing coordinator.
     * - The tour status must be "Pending".
     *
     * Postconditions:
     * - Updates the tour status to "Approved".
     * - Sends notifications to relevant guides.
     * - Returns status 202 (ACCEPTED) if successful.
     *
     * @param approveRejectTour DTO containing the tour ID and coordinator email.
     * @return ResponseEntity with the updated tour or error status.
     */
    @PutMapping("/approve")
    public ResponseEntity<Tour> approveTour(@RequestBody ApproveRejectTour approveRejectTour) {
        Tour tour = tourService.getTourById(approveRejectTour.getTourId());

        if(coordinatorService.getCoordinatorByEmail(approveRejectTour.getCoordinatorEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(!tour.getTourStatus().equals("Pending")){
            return new ResponseEntity<>(HttpStatus.CONFLICT); // tur coordinatore pending bir şekilde verilmesi lazım ki onaylasın veya reddetsin
        }

        // Notification Logic
        for (TourGuide guide: tourGuideService.getAllTourGuides()) {
            notifyForTour(tour, guide.getEmail(), "Guide Tour Addition");
        }

        return new ResponseEntity<>(tourService.setStatusApproved(tour), HttpStatus.ACCEPTED);
    }

    /**
     * Rejects a tour.
     *
     * Preconditions:
     * - `approveRejectTour` must not be null.
     * - `approveRejectTour.getCoordinatorEmail` must correspond to an existing coordinator.
     * - The tour status must be "Pending".
     *
     * Postconditions:
     * - Updates the tour status to "Rejected".
     * - Sends notifications to relevant individuals.
     * - Returns status 202 (ACCEPTED) if successful.
     *
     * @param approveRejectTour DTO containing the tour ID and coordinator email.
     * @return ResponseEntity with the updated tour or error status.
     */
    @PutMapping("/reject")
    public ResponseEntity<Tour> rejectTour(@RequestBody ApproveRejectTour approveRejectTour) {
        Tour tour = tourService.getTourById(approveRejectTour.getTourId());

        if(coordinatorService.getCoordinatorByEmail(approveRejectTour.getCoordinatorEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(!tour.getTourStatus().equals("Pending")){
            return new ResponseEntity<>(HttpStatus.CONFLICT); // tur coordinatore pending bir şekilde verilmesi lazım ki onaylasın veya reddetsin
        }

        // Notification Logic
        if (tour.getTourApplication() instanceof SchoolTourApplication schoolTourApplication) {
            notifyForTour(tour, schoolTourApplication.getApplyingCounselor().getEmail(), "Counselor Tour Rejected");
        }
        else if (tour.getTourApplication() instanceof IndividualTourApplication individualTourApplication) {
            notifyForTour(tour, individualTourApplication.getEmail(), "Individual Tour Rejected");
        }

        return new ResponseEntity<>(tourService.setStatusRejected(tour), HttpStatus.ACCEPTED);
    }

    /**
     * Enrolls a tour guide in a tour.
     *
     * Preconditions:
     * - `tourOperationsForGuide` must not be null.
     * - `tourOperationsForGuide.getTourId` must correspond to an existing tour.
     * - `tourOperationsForGuide.getApplyingGuideEmail` must correspond to an existing guide.
     * - The tour status must be "Approved", "Withdrawn", or "WithdrawRequested".
     *
     * Postconditions:
     * - Assigns the guide to the specified tour.
     * - Sends notifications based on the enrollment status.
     * - Returns status 201 (CREATED) if successful.
     * - Returns status 404 (NOT_FOUND) if the guide or tour does not exist.
     * - Returns status 400 (BAD_REQUEST) if the status does not allow enrollment.
     *
     * @param tourOperationsForGuide DTO containing tour ID and guide email.
     * @return ResponseEntity with the updated tour or error status.
     */
    @PostMapping("/enroll")
    public ResponseEntity<Tour> enrollInTour(@RequestBody TourOperationsForGuide tourOperationsForGuide) {
        Tour tour = tourService.getTourById(tourOperationsForGuide.getTourId());
        if(tourGuideService.getTourGuideByEmail(tourOperationsForGuide.getApplyingGuideEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        if(tour.getTourStatus().equals("Approved") || tour.getTourStatus().equals("Withdrawn") || tour.getTourStatus().equals("WithdrawRequested")){

            // Notification Logic
            // Notify applying tour guide
            notifyForTour(tour, tourOperationsForGuide.getApplyingGuideEmail(), "Guide Toure Approved");
            // Notify visitors
            if (tour.getTourStatus().equals("Approved")) {
                TourGuide tourGuide = tourGuideService.getTourGuideByEmail( tourOperationsForGuide.getApplyingGuideEmail() );
                if (tour.getTourApplication() instanceof SchoolTourApplication schoolTourApplication){
                    notifyForTour(tour, schoolTourApplication.getApplyingCounselor().getEmail(),"Counselor Tour Accepted");
                }
                else if (tour.getTourApplication() instanceof IndividualTourApplication individualTourApplication) {
                    notifyForTour(tour, individualTourApplication.getEmail(), "Individual Tour Accepted");
                }
            }
            // Notify Tour Guide Who Withdrew
            else if (tour.getTourStatus().equals("Withdrawn") || tour.getTourStatus().equals("WithdrawRequested")) {
                notifyForTour(tour, tour.getAssignedGuideEmail(), "Guide Withdrawn Tour Accepted");
            }
            // Notification Logic End

            return new ResponseEntity<>(tourService.assignTour(tour,
                    tourOperationsForGuide.getApplyingGuideEmail()), HttpStatus.CREATED);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Handles a withdraw request from a tour guide.
     *
     * Preconditions:
     * - `tourOperationsForGuide` must not be null.
     * - `tourOperationsForGuide.getTourId` must correspond to an existing tour.
     * - `tourOperationsForGuide.getApplyingGuideEmail` must correspond to the assigned guide.
     *
     * Postconditions:
     * - Updates the tour status to "WithdrawRequested".
     * - Notifies relevant advisors about the request.
     * - Returns status 201 (CREATED) if successful.
     * - Returns status 404 (NOT_FOUND) if the guide or tour does not exist.
     * - Returns status 400 (BAD_REQUEST) if the guide is not assigned to the tour.
     *
     * @param tourOperationsForGuide DTO containing tour ID and guide email.
     * @return ResponseEntity with the updated tour or error status.
     */
    @PostMapping("/request-withdraw")
    public ResponseEntity<Tour> requestWithdraw(@RequestBody TourOperationsForGuide tourOperationsForGuide) {
        Tour tour = tourService.getTourById(tourOperationsForGuide.getTourId());
        if(tourGuideService.getTourGuideByEmail(tourOperationsForGuide.getApplyingGuideEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        if(Objects.equals(tour.getAssignedGuide().getId(), tourGuideService.getTourGuideByEmail(tourOperationsForGuide.getApplyingGuideEmail()).getId())){

            // Notification Logic
            for (Advisor advisor: advisorService.getAllAdvisors()) {
                if(advisor.getAssignedDay().equals(tour.getChosenDate().getDayOfWeek().toString())){
                    notifyForTour(tour, advisor.getEmail(), "Advisor Tour Withdraw Request");
                }
            }

            return new ResponseEntity<>(tourService.requestWithdraw(tour), HttpStatus.CREATED);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Rejects a withdraw request from a tour guide.
     *
     * Preconditions:
     * - `tourOperationsForAdvisor` must not be null.
     * - `tourOperationsForAdvisor.getTourId` must correspond to an existing tour.
     * - `tourOperationsForAdvisor.getAdvisorEmail` must correspond to an existing advisor.
     * - The tour status must be "WithdrawRequested".
     * - The advisor's assigned day must match the tour's chosen date.
     *
     * Postconditions:
     * - The withdraw request is rejected.
     * - Sends a notification to the guide about the rejection.
     * - Returns status 201 (CREATED) if the request is successfully rejected.
     * - Returns status 404 (NOT_FOUND) if the advisor or tour does not exist.
     * - Returns status 400 (BAD_REQUEST) if the preconditions are not met.
     *
     * @param tourOperationsForAdvisor DTO containing the tour ID and advisor email.
     * @return ResponseEntity with the updated tour or error status.
     */
    @PutMapping("/reject-withdraw-request")
    public ResponseEntity<Tour> rejectWithdraw(@RequestBody TourOperationsForAdvisor tourOperationsForAdvisor) {
        Tour tour = tourService.getTourById(tourOperationsForAdvisor.getTourId());
        if(advisorService.getAdvisorByEmail(tourOperationsForAdvisor.getAdvisorEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        Advisor advisor = advisorService.getAdvisorByEmail(tourOperationsForAdvisor.getAdvisorEmail());
        if(tour.getTourStatus().equals("WithdrawRequested") && tour.getChosenDate().getDayOfWeek().toString().equalsIgnoreCase(advisor.getAssignedDay())){
            // Notification Logic

            notifyForTour(tour, tour.getAssignedGuide().getEmail(), "Guide Withdraw Request Rejected");

            return new ResponseEntity<>(tourService.rejectWithdrawRequest(tour, tourOperationsForAdvisor.getAdvisorEmail()), HttpStatus.CREATED);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Accepts a withdraw request from a tour guide.
     *
     * Preconditions:
     * - `tourOperationsForAdvisor` must not be null.
     * - `tourOperationsForAdvisor.getTourId` must correspond to an existing tour.
     * - `tourOperationsForAdvisor.getAdvisorEmail` must correspond to an existing advisor.
     * - The tour status must be "WithdrawRequested".
     *
     * Postconditions:
     * - The withdraw request is accepted.
     * - Sends a notification to the guide about the acceptance.
     * - Returns status 201 (CREATED) if the request is successfully accepted.
     * - Returns status 404 (NOT_FOUND) if the advisor or tour does not exist.
     * - Returns status 400 (BAD_REQUEST) if the preconditions are not met.
     *
     * @param tourOperationsForAdvisor DTO containing the tour ID and advisor email.
     * @return ResponseEntity with the updated tour or error status.
     */
    @PutMapping("/accept-withdraw-request")
    public ResponseEntity<Tour> acceptWithdraw(@RequestBody TourOperationsForAdvisor tourOperationsForAdvisor) {
        Tour tour = tourService.getTourById(tourOperationsForAdvisor.getTourId());
        if(advisorService.getAdvisorByEmail(tourOperationsForAdvisor.getAdvisorEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        if(tour.getTourStatus().equals("WithdrawRequested")){
            // Notification Logic
            notifyForTour(tour, tour.getAssignedGuide().getEmail(), "Guide Withdraw Request Accepted");

            return new ResponseEntity<>(tourService.acceptWithdrawRequest(tour, tourOperationsForAdvisor.getAdvisorEmail()), HttpStatus.CREATED);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Submits the activity report for a completed tour.
     *
     * Preconditions:
     * - `tourId` must correspond to an existing tour.
     * - `tourGuideEmail` must correspond to the assigned guide.
     * - `duration` must be greater than 0.
     *
     * Postconditions:
     * - Updates the tour's duration and status to "Finished".
     * - Creates a payment for the tour guide.
     * - Returns status 201 (CREATED) if successful.
     * - Returns status 404 (NOT_FOUND) if the tour or guide does not exist.
     * - Returns status 400 (BAD_REQUEST) for invalid inputs.
     * - Returns status 409 (CONFLICT) if the guide does not match the assigned guide.
     *
     * @param tourId The ID of the completed tour.
     * @param tourGuideEmail The email of the assigned tour guide.
     * @param duration The duration of the tour.
     * @return ResponseEntity with the updated tour or error status.
     */
    @PostMapping("/submit-activity")
    public ResponseEntity<?> submitTourActivity(@RequestParam Long tourId,
                                                @RequestParam String tourGuideEmail,
                                                @RequestParam Double duration) {

        try {
            if (tourId == null || tourGuideEmail == null || duration <= 0) {
                return ResponseEntity.badRequest()
                        .body("Invalid input: Tour ID, Tour Guide ID, and duration must be provided, and duration should be greater than 0.");
            }

            System.out.println("Fetching Tour...");
            Tour tour = tourService.getTourById(tourId);

            System.out.println("Fetching Tour Guide...");
            TourGuide tourGuide = tourGuideService.getTourGuideByEmail(tourGuideEmail);

            // Check if tour or tour guide does not exist
            if (tour == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour with ID " + tourId + " not found.");
            }
            if (tourGuide == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour Guide with ID " + tourGuideEmail + " not found.");
            }

            // Check if the assigned guide matches
            if (tour.getAssignedGuideEmail() == null || !tour.getAssignedGuideEmail().equals(tourGuide.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Mismatch: The provided Tour Guide is not assigned to this tour.");
            }

            Tour updatedTour = tourService.submitTourActivity(tour, duration);
            paymentController.createPaymentForTour(tourGuideEmail, tourId);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(updatedTour);

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
     * Edits the activity report for a tour.
     *
     * Preconditions:
     * - `tourId` must correspond to an existing tour.
     * - `tourGuideEmail` must correspond to the assigned guide.
     * - `duration` must be greater than 0.
     *
     * Postconditions:
     * - Updates the tour's duration and status to "Finished".
     * - Updates the guide's work hours accordingly.
     * - Returns status 201 (CREATED) if successful.
     * - Returns status 404 (NOT_FOUND) if the tour or guide does not exist.
     * - Returns status 400 (BAD_REQUEST) for invalid inputs.
     * - Returns status 409 (CONFLICT) if the guide does not match the assigned guide.
     *
     * @param tourId The ID of the tour.
     * @param tourGuideEmail The email of the assigned tour guide.
     * @param duration The new duration of the tour.
     * @return ResponseEntity with the updated tour or error status.
     */
    @PostMapping("/edit-activity")
    public ResponseEntity<?> editTourActivity(@RequestParam Long tourId,
                                                @RequestParam String tourGuideEmail,
                                                @RequestParam Double duration) {
        try {
            if (tourId == null || tourGuideEmail == null || duration <= 0) {
                return ResponseEntity.badRequest()
                        .body("Invalid input: Tour ID, Tour Guide ID, and duration must be provided, and duration should be greater than 0.");
            }
            Tour tour = tourService.getTourById(tourId);
            TourGuide tourGuide = tourGuideService.getTourGuideByEmail(tourGuideEmail);

            // Check if tour or tour guide does not exist
            if (tour == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour with ID " + tourId + " not found.");
            }
            if (tourGuide == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour Guide with ID " + tourGuideEmail + " not found.");
            }

            // Check if the assigned guide matches
            if (tour.getAssignedGuideEmail() == null || !tour.getAssignedGuideEmail().equals(tourGuide.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Mismatch: The provided Tour Guide is not assigned to this tour.");
            }

            Tour updatedTour = tourService.editTourActivity(tour, duration);
            paymentController.createPaymentForTour(tourGuideEmail, tourId);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(updatedTour);

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
     * Retrieves all tours scheduled in a specific month and year.
     *
     * Preconditions:
     * - `month` must be a valid month (1-12).
     * - `year` must be a positive integer.
     *
     * Postconditions:
     * - Returns a list of tours scheduled in the specified month and year.
     * - Returns status 200 (OK) with the list of tours.
     *
     * @param month The month to filter tours.
     * @param year The year to filter tours.
     * @return ResponseEntity containing the list of tours.
     */
    @GetMapping("/by-month")
    public ResponseEntity<List<Tour>> getToursByMonthAndYear(
            @RequestParam int month,
            @RequestParam int year) {
        List<Tour> tours = tourService.getToursByMonthAndYear(month, year);
        return ResponseEntity.ok(tours);
    }

    /**
     * Retrieves all finished tours in a specific month and year.
     *
     * Preconditions:
     * - `month` must be a valid month (1-12).
     * - `year` must be a positive integer.
     *
     * Postconditions:
     * - Returns a list of finished tours in the specified month and year.
     * - Returns status 200 (OK) with the list of tours.
     *
     * @param month The month to filter finished tours.
     * @param year The year to filter finished tours.
     * @return ResponseEntity containing the list of finished tours.
     */
    @GetMapping("/by-month/finished")
    public ResponseEntity<List<Tour>> getFinishedToursByMonthAndYear(
            @RequestParam int month,
            @RequestParam int year) {
        List<Tour> finishedTours = tourService.getFinishedToursByMonthAndYear(month, year);
        return ResponseEntity.ok(finishedTours);
    }

    /**
     * Sends notifications related to a tour.
     *
     * Preconditions:
     * - `tour` must not be null and must contain valid details.
     * - `email` must be a valid email address.
     * - `situation` must be a recognized situation type.
     *
     * Postconditions:
     * - Sends a notification to the specified email address.
     * - Generates appropriate notification content based on the situation.
     *
     * @param tour The tour for which the notification is sent.
     * @param email The email address to send the notification.
     * @param situation The situation type that determines the notification content.
     */
    private void notifyForTour(Tour tour, String email, String situation) {
        String title = null;
        String text = null;
        String textForBTOMember = "Tarih: " + tour.getChosenDate() +"<br>" +
                                "Saat: " + tour.getChosenTimeSlot().getDisplayName() +"<br>" +
                                "Lise: " + tour.getApplyingHighschool().getSchoolName() +"<br>" +
                                "Ziyaretçi Sayısı: " + tour.getVisitorCount();

        String textForVisitor = "Tarih: " + tour.getChosenDate() +"<br>" +
                                "Saat: " + tour.getChosenTimeSlot().getDisplayName();

        if (situation.equals("Guide Tour Addition")) {
            title = "Bir Tur Daha Takvime Eklendi.";
            text = "Takvime Eklenen Turun Bilgisi: <br>" + textForBTOMember;
        }
        else if (situation.equals("Counselor Tour Rejected")) {
            title = "Ne yazık ki  zaman yetersizliğinden dolayı tur isteğiniz kabul edilememiştir.";
            SchoolTourApplication schoolTourApplication = (SchoolTourApplication) tour.getTourApplication();
            text = "Reddedilen Turun Bilgisi: <br>" + textForVisitor;
        }
        else if (situation.equals("Individual Tour Rejected")) {
            title = "Ne yazık ki  zaman yetersizliğinden dolayı tur isteğiniz kabul edilememiştir.";
            text = "Reddedilen Turun Bilgisi: <br>" + textForVisitor;
        }
        else if (situation.equals("Counselor Tour Accepted")) {
            title = "Üniversite Turu İsteğiniz Onaylandı";
            text = "Tur Bilgisi: <br>" + textForVisitor;
        }
        else if (situation.equals("Individual Tour Accepted")) {
            title = "Üniversite Turu İsteğiniz Onaylandı";
            text = "Tur Bilgisi: <br>" + textForVisitor;
        }
        else if (situation.equals("Guide Withdrawn Tour Accepted")) {
            title = "Turdan Çekilme İsteğiniz Kabul Edildi";
            text = "Çekildiğiniz Turun Bilgisi: <br>" + textForBTOMember;
        }
        else if (situation.equals("Advisor Tour Withdraw Request")) {
            title = "Bir Rehber Turdan Çekilmek İstiyor";
            text = "Tur Bilgisi: <br>" + textForBTOMember;
        }
        else if (situation.equals("Guide Withdraw Request Rejected")) {
            title = "Turdan Çekilme İsteğiniz Danışman Tarafından Reddedildi";
            text = "Tur Bilgisi: <br>" + textForBTOMember;
        }
        else if (situation.equals("Guide Withdraw Request Accepted")) {
            title = "Turdan Çekilme İsteğiniz Danışman Tarafından Kabul Edildi";
            text = "Çekildiğiniz Turun Bilgisi: <br>" + textForBTOMember;
        }

        if (title != null || text != null) {
            notificationService.createNotification(email, title, text);
        }
    }
}

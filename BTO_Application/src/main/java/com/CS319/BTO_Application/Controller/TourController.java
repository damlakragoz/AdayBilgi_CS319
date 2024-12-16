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

    @Autowired
    public TourController(TourService tourAssignmentService, CoordinatorService coordinatorService, TourGuideService tourGuideService, SchoolTourApplicationService schoolTourApplicationService, AdvisorService advisorService, CounselorService counselorService, PaymentController paymentController){
        this.tourService = tourAssignmentService;
        this.coordinatorService = coordinatorService;
        this.tourGuideService = tourGuideService;
        this.schoolTourApplicationService = schoolTourApplicationService;
        this.advisorService = advisorService;
        this.counselorService = counselorService;
        this.paymentController = paymentController;
    }


    /*
        the fields that are the same with Tour instance and TourApplication instance are:
           +visitorCount
           +application.applyingCounselor.getSchool = tour.applyingSchool
           not: tourda ve applciationde ayrı ayrı school ve counselor tutulabilir. Şu anda applicationde counselor turda school tutuluyor
     */
    @PostMapping("/create")
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

        Tour tour = new Tour(visitorCount, selectedTimeSlot, selectedDate,"Pending", applyingSchool, schoolTourApplication);

        return new ResponseEntity<>(tourService.createSchoolTour(tour, schoolTourApplication), HttpStatus.CREATED);

    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllTours() {

        try {
            // Fetch all tour guides from the service
            System.out.println("controşller");
            List<Tour> tours = tourService.getAllTours();
            return ResponseEntity.ok(tours); // Return the list of tours with a 200 OK status
        } catch (Exception ex) {
            System.err.println("Error: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tours.");
        }
    }

    @GetMapping("/get/assignedGuide")
    public ResponseEntity<?> getAssignedGuide(@RequestParam Long tourId) {
        try {
            // Fetch all tour guides from the service
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
    @PutMapping("/approve")
    public ResponseEntity<Tour> approveTour(@RequestBody ApproveRejectTour approveRejectTour) {
        Tour tour = tourService.getTourById(approveRejectTour.getTourId());

        if(coordinatorService.getCoordinatorByEmail(approveRejectTour.getCoordinatorEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(!tour.getTourStatus().equals("Pending")){
            return new ResponseEntity<>(HttpStatus.CONFLICT); // tur coordinatore pending bir şekilde verilmesi lazım ki onaylasın veya reddetsin
        }
        return new ResponseEntity<>(tourService.setStatusApproved(tour), HttpStatus.ACCEPTED);
    }

    @PutMapping("/reject")
    public ResponseEntity<Tour> rejectTour(@RequestBody ApproveRejectTour approveRejectTour) {
        Tour tour = tourService.getTourById(approveRejectTour.getTourId());

        if(coordinatorService.getCoordinatorByEmail(approveRejectTour.getCoordinatorEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(!tour.getTourStatus().equals("Pending")){
            return new ResponseEntity<>(HttpStatus.CONFLICT); // tur coordinatore pending bir şekilde verilmesi lazım ki onaylasın veya reddetsin
        }
        return new ResponseEntity<>(tourService.setStatusRejected(tour), HttpStatus.ACCEPTED);
    }


    @PostMapping("/enroll")
    public ResponseEntity<Tour> enrollInTour(@RequestBody TourOperationsForGuide tourOperationsForGuide) {
        Tour tour = tourService.getTourById(tourOperationsForGuide.getTourId());
        if(tourGuideService.getTourGuideByEmail(tourOperationsForGuide.getApplyingGuideEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        if(tour.getTourStatus().equals("Approved") || tour.getTourStatus().equals("Withdrawn") || tour.getTourStatus().equals("WithdrawRequested")){
            return new ResponseEntity<>(tourService.assignTour(tour,
                    tourOperationsForGuide.getApplyingGuideEmail()), HttpStatus.CREATED);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/request-withdraw")
    public ResponseEntity<Tour> requestWithdraw(@RequestBody TourOperationsForGuide tourOperationsForGuide) {
        Tour tour = tourService.getTourById(tourOperationsForGuide.getTourId());
        if(tourGuideService.getTourGuideByEmail(tourOperationsForGuide.getApplyingGuideEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        if(Objects.equals(tour.getAssignedGuide().getId(), tourGuideService.getTourGuideByEmail(tourOperationsForGuide.getApplyingGuideEmail()).getId())){
            return new ResponseEntity<>(tourService.requestWithdraw(tour), HttpStatus.CREATED);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/reject-withdraw-request")
    public ResponseEntity<Tour> rejectWithdraw(@RequestBody TourOperationsForAdvisor tourOperationsForAdvisor) {
        Tour tour = tourService.getTourById(tourOperationsForAdvisor.getTourId());
        if(advisorService.getAdvisorByEmail(tourOperationsForAdvisor.getAdvisorEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        if(tour.getTourStatus().equals("WithdrawRequested")){
            return new ResponseEntity<>(tourService.rejectWithdrawRequest(tour, tourOperationsForAdvisor.getAdvisorEmail()), HttpStatus.CREATED);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/accept-withdraw-request")
    public ResponseEntity<Tour> acceptWithdraw(@RequestBody TourOperationsForAdvisor tourOperationsForAdvisor) {
        Tour tour = tourService.getTourById(tourOperationsForAdvisor.getTourId());
        if(advisorService.getAdvisorByEmail(tourOperationsForAdvisor.getAdvisorEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        if(tour.getTourStatus().equals("WithdrawRequested")){
            return new ResponseEntity<>(tourService.acceptWithdrawRequest(tour, tourOperationsForAdvisor.getAdvisorEmail()), HttpStatus.CREATED);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

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
            paymentController.createPayment(tourGuideEmail, tourId);

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

    @GetMapping("/by-month")
    public ResponseEntity<List<Tour>> getToursByMonthAndYear(
            @RequestParam int month,
            @RequestParam int year) {
        List<Tour> tours = tourService.getToursByMonthAndYear(month, year);
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/by-month/finished")
    public ResponseEntity<List<Tour>> getFinishedToursByMonthAndYear(
            @RequestParam int month,
            @RequestParam int year) {
        List<Tour> finishedTours = tourService.getFinishedToursByMonthAndYear(month, year);
        return ResponseEntity.ok(finishedTours);
    }

}

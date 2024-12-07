package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.ApproveRejectTour;
import com.CS319.BTO_Application.DTO.TourOperationsForAdvisor;
import com.CS319.BTO_Application.DTO.TourOperationsForGuide;
import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@RequestMapping("api/tour")
@Controller
public class TourController {

    private final TourService tourService;
    private final TourGuideService tourGuideService;
    private final CoordinatorService coordinatorService;
    private final TourApplicationService tourApplicationService;
    private final AdvisorService advisorService;

    @Autowired
    public TourController(TourService tourAssignmentService, CoordinatorService coordinatorService, TourGuideService tourGuideService, TourApplicationService tourApplicationService, AdvisorService advisorService){
        this.tourService = tourAssignmentService;
        this.coordinatorService = coordinatorService;
        this.tourGuideService = tourGuideService;
        this.tourApplicationService = tourApplicationService;
        this.advisorService = advisorService;
    }


    /*
        the fields that are the same with Tour instance and TourApplication instance are:
           +visitorCount
           +application.applyingCounselor.getSchool = tour.applyingSchool
           not: tourda ve applciationde ayrı ayrı school ve counselor tutulabilir. Şu anda applicationde counselor turda school tutuluyor
     */
    @PostMapping("/create")
    public ResponseEntity<Tour> createTour(@RequestParam Long tourApplicationId) {
        SchoolTourApplication schoolTourApplication = tourApplicationService.getSchoolTourApplicationById(tourApplicationId);
        /*
            TODO:
                date assignment algorithm will work here
         */
        Date chosenDate = schoolTourApplication.getRequestedDates().get(0);
        Integer visitorCount = schoolTourApplication.getVisitorCount();
        HighSchool applyingSchool = schoolTourApplication.getApplyingHighschool();

        Tour tour = new Tour(visitorCount, chosenDate,"Pending", applyingSchool, schoolTourApplication);

        if(!schoolTourApplication.getApplicationStatus().equals("Pending")){// if status not pending
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        else{
            /*
                make the status of application: "Scheduled" in createSchoolTour method
                the status of tour is: Pending (it will be approved by coordinator then assigned)
             */
            return new ResponseEntity<>(tourService.createSchoolTour(tour, schoolTourApplication), HttpStatus.CREATED);
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllTours() {
        try {
            // Fetch all tour guides from the service
            List<Tour> tours = tourService.getAllTours();
            return ResponseEntity.ok(tours); // Return the list of tours with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tours.");
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
        if(tour.getTourStatus().equals("Approved") || tour.getTourStatus().equals("Withdrawn")){
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


}

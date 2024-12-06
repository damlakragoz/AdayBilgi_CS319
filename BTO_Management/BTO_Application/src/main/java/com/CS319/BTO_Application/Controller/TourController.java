package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.ApproveRejectTour;
import com.CS319.BTO_Application.DTO.TourAssignmentRequest;
import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Service.CoordinatorService;
import com.CS319.BTO_Application.Service.TourApplicationService;
import com.CS319.BTO_Application.Service.TourService;
import com.CS319.BTO_Application.Service.TourGuideService;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RequestMapping("api/tour")
@Controller
public class TourController {

    private final TourService tourService;
    private final TourGuideService tourGuideService;
    private final CoordinatorService coordinatorService;
    private final TourApplicationService tourApplicationService;

    @Autowired
    public TourController(TourService tourAssignmentService, CoordinatorService coordinatorService, TourGuideService tourGuideService, TourApplicationService tourApplicationService){
        this.tourService = tourAssignmentService;
        this.coordinatorService = coordinatorService;
        this.tourGuideService = tourGuideService;
        this.tourApplicationService = tourApplicationService;
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

    /*
        This method receives coordinator email as a parameter and checks if that coordinator exists
        and if that coordinator exists then changes the status of the tourApplication from "Pending" to "Approved" or "Rejected"
     */
    @PutMapping("/changeStatus")
    public ResponseEntity<Tour> changeStatus(@RequestBody ApproveRejectTour approveRejectTour) {
        Tour tour = tourService.getTourById(approveRejectTour.getTourId());

        if(coordinatorService.getCoordinatorByEmail(approveRejectTour.getCoordinatorEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(!tour.getTourStatus().equals("Pending")){
            return new ResponseEntity<>(HttpStatus.CONFLICT); // tur coordinatore pending bir şekilde verilmesi lazım ki onaylasın veya reddetsin
        }
        return new ResponseEntity<>(tourService.changeTourStatus(tour, approveRejectTour.getStatus()), HttpStatus.ACCEPTED);
    }


    @PostMapping("/enroll")
    public ResponseEntity<Tour> enrollInTour(@RequestBody TourAssignmentRequest tourAssignmentRequest) {
        Tour tour = tourService.getTourById(tourAssignmentRequest.getTourId());
        if(tourGuideService.getTourGuideByEmail(tourAssignmentRequest.getApplyingGuideEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        if(tour.getTourStatus().equals("Approved")){
            return new ResponseEntity<>(tourService.assignTour(tour,
                    tourAssignmentRequest.getApplyingGuideEmail()), HttpStatus.CREATED);
        }
        else{ // if statuses are enrolled, rejected or pending
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}

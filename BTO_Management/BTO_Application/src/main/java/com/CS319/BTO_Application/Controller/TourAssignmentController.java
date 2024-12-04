package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.TourAssignmentRequest;
import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Service.TourApplicationService;
import com.CS319.BTO_Application.Service.TourAssignmentService;
import com.CS319.BTO_Application.Service.TourGuideService;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Date;

@RequestMapping("api/tour-applications")
@Controller
public class TourAssignmentController {

    private final TourAssignmentService tourAssignmentService;
    private final TourGuideService tourGuideService;
    private final TourApplicationService tourApplicationService;

    @Autowired
    public TourAssignmentController(TourAssignmentService tourAssignmentService, TourGuideService tourGuideService, TourApplicationService tourApplicationService){
        this.tourAssignmentService = tourAssignmentService;
        this.tourGuideService = tourGuideService;
        this.tourApplicationService = tourApplicationService;
    }



    @PostMapping("/enroll")
    public ResponseEntity<Tour> enrollInTour(@RequestBody TourAssignmentRequest tourAssignmentRequest) {
        SchoolTourApplication schoolTourApplication = tourApplicationService.getSchoolTourApplicationById(tourAssignmentRequest.getTourApplicationId());

        if(tourGuideService.getTourGuideByEmail(tourAssignmentRequest.getApplyingGuideEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        if(schoolTourApplication.getStatus().equals("Approved")){
            return new ResponseEntity<>(tourAssignmentService.addSchoolTour(tourAssignmentRequest.getTour(),
                    tourAssignmentRequest.getApplyingGuideEmail(), schoolTourApplication), HttpStatus.CREATED);
        }
        else{ // if statuses are enrolled, rejected or pending
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }


    }
}

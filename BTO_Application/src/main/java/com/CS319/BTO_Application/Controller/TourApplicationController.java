
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
    //there will be logic for individual tourapplciation also

    @Autowired
    public TourApplicationController(SchoolTourApplicationService schoolTourApplicationService, IndividualTourApplicationService individualTourApplicationService,
                                     CounselorService counselorService, HighSchoolService highSchoolService, TourApplicationService tourApplicationService, TourService tourService) {
        this.schoolTourApplicationService = schoolTourApplicationService;
        this.individualTourApplicationService = individualTourApplicationService;
        this.counselorService = counselorService;
        this.highSchoolService = highSchoolService;
        this.tourApplicationService = tourApplicationService;
        this.tourService = tourService;
    }



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

    @PostMapping("/add/school-application")
    public ResponseEntity<SchoolTourApplication> addSchoolApplication(@RequestBody AddSchoolApplicationRequest applicationRequest) {
        if(counselorService.getCounselorByUsername(applicationRequest.getCounselorUsername()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by username

        return new ResponseEntity<>(schoolTourApplicationService.addSchoolApplication(applicationRequest.getTourApplication(),applicationRequest.getCounselorUsername()), HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/school-application")
    public ResponseEntity<SchoolTourApplication> deleteSchoolApplication(@RequestParam Long tourApplicationId) {
        schoolTourApplicationService.deleteSchoolTourApplicationById(tourApplicationId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
////////////////////////////
// SchoolTourApplication Methods END

    ////////////////////////////
// IndividualTourApplication Methods START

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

    @PostMapping("/add/individual-application")
    public ResponseEntity<?> addIndividualApplication(@RequestBody AddIndividualApplicationRequest applicationRequest) {
        HighSchool highSchool = highSchoolService.getSchoolByName(applicationRequest.getSchoolName());
        if (highSchool == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(individualTourApplicationService.addIndividualApplication(applicationRequest.getIndividualTourApplication(),
                applicationRequest.getSchoolName()), HttpStatus.CREATED);
    }

    @DeleteMapping("delete/individual-application")
    public ResponseEntity<?> deleteIndividualApplication(@RequestParam Long tourApplicationId) {
        individualTourApplicationService.deleteIndividualTourApplicationById(tourApplicationId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/counselor/cancel")
    public ResponseEntity<SchoolTourApplication> cancelSchoolTourApplication(@RequestParam String counselorEmail,@RequestParam Long tourApplicationId) {
        SchoolTourApplication schoolTourApplication = schoolTourApplicationService.getSchoolTourApplicationById(tourApplicationId);
        if(counselorService.getCounselorByUsername(counselorEmail) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        Counselor counselor = counselorService.getCounselorByUsername(counselorEmail);
        if(schoolTourApplication.getApplyingCounselor().equals(counselor)){
            tourService.cancelTourByCounselor(tourApplicationId);
            return new ResponseEntity<>(schoolTourApplicationService.cancelSchoolTourApplication(counselorEmail, tourApplicationId), HttpStatus.ACCEPTED);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    ////////////////////////////
// IndividualTourApplication Methods END


}


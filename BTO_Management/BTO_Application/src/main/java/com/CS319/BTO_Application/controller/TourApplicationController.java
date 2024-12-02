
package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.AddSchoolApplicationRequest;
import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Entity.TourApplication;
import com.CS319.BTO_Application.Service.CounselorService;
import com.CS319.BTO_Application.Service.TourApplicationService;
import com.CS319.BTO_Application.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3002")
@RequestMapping("api/tour-applications")
@Controller
public class TourApplicationController{

    private final TourApplicationService tourApplicationService;
    private final CounselorService counselorService;
    //there will be logic for individual tourapplciation also

    @Autowired
    public TourApplicationController(TourApplicationService tourApplicationService, CounselorService counselorService) {
        this.tourApplicationService = tourApplicationService;
        this.counselorService = counselorService;
    }

    @GetMapping("/getAll")
    public List<TourApplication> getAllTourApplications() {
        return tourApplicationService.getAllTourApplications();
    }

    @PostMapping("/add")
    public ResponseEntity<TourApplication> addSchoolApplication(@RequestBody AddSchoolApplicationRequest applicationRequest) {
        if(counselorService.getCounselorByUsername(applicationRequest.getCounselorUsername()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by username

        return new ResponseEntity<>(tourApplicationService.addSchoolApplication(applicationRequest.getTourApplication(),applicationRequest.getCounselorUsername()), HttpStatus.CREATED);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<TourApplication> deleteSchoolApplication(@RequestParam Long tourApplicationId) {
        tourApplicationService.deleteById(tourApplicationId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}


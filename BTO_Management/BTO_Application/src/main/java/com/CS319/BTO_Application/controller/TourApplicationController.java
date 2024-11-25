
package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.AddSchoolApplicationRequest;
import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Entity.TourApplication;
import com.CS319.BTO_Application.Service.TourApplicationService;
import com.CS319.BTO_Application.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/tour-applications")
@Controller
public class TourApplicationController{

    private final TourApplicationService tourApplicationService;
    private final UserService userService;

    @Autowired
    public TourApplicationController(TourApplicationService tourApplicationService, UserService userService) {
        this.tourApplicationService = tourApplicationService;
        this.userService = userService;
    }

    @GetMapping("/getAll")
    public List<TourApplication> getAllTourApplications() {
        return tourApplicationService.getAllTourApplications();
    }

    @PostMapping("/add")
    public ResponseEntity<TourApplication> addSchoolApplication(@RequestBody AddSchoolApplicationRequest applicationRequest) {
        Counselor applyingCounselor = applicationRequest.getCounselor();

        if(userService.getUserByUsername(applyingCounselor.getUsername()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by username
        if(userService.getUserByUsername(applyingCounselor.getUsername()).getId() != applyingCounselor.getId()){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(tourApplicationService.addSchoolApplication(applicationRequest.getTourApplication(),applicationRequest.getCounselor()), HttpStatus.CREATED);
    }

}


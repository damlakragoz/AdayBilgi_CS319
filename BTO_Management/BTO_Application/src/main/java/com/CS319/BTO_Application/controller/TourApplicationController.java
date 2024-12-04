
package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.AddSchoolApplicationRequest;
import com.CS319.BTO_Application.DTO.ApproveRejectTourApplication;
import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.FairInvitation;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Entity.TourApplication;
import com.CS319.BTO_Application.Service.CoordinatorService;
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
    private final CoordinatorService coordinatorService;
    //there will be logic for individual tourapplciation also

    @Autowired
    public TourApplicationController(TourApplicationService tourApplicationService, CounselorService counselorService, CoordinatorService coordinatorService) {
        this.tourApplicationService = tourApplicationService;
        this.counselorService = counselorService;
        this.coordinatorService = coordinatorService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllTourApplications() {
        try {
            // Fetch all tour guides from the service
            List<TourApplication> tourApplications = tourApplicationService.getAllTourApplications();
            return ResponseEntity.ok(tourApplications); // Return the list of tour guides with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour applications.");
        }
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

    /*
        This method receives coordiantor email as a parameter and checks if that coordinator exists
        and if that coordinator exists then changes the status of the tourApplication from "Pending" to "Approved"
     */
    @PutMapping("/changeStatus")
    public ResponseEntity<TourApplication> changeStatus(@RequestBody ApproveRejectTourApplication approveRejectTourApplication) {
        SchoolTourApplication schoolTourApplication = tourApplicationService.getSchoolTourApplicationById(approveRejectTourApplication.getTourApplicationId());
        if(coordinatorService.getCoordinatorByEmail(approveRejectTourApplication.getCoordinatorEmail()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(!schoolTourApplication.getStatus().equals("pending")){
            return new ResponseEntity<>(HttpStatus.CONFLICT); // no idea what conflict is
        }
        return new ResponseEntity<>(tourApplicationService.changeApplicationStatus(schoolTourApplication,
                approveRejectTourApplication.getStatus()), HttpStatus.ACCEPTED);
    }

}


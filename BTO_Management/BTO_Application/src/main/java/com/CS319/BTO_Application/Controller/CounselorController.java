package com.CS319.BTO_Application.Controller;
//import com.CS319.BTO_Application.Service.UserService;
import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Service.CounselorService;
import com.CS319.BTO_Application.Service.FairInvitationService;
import com.CS319.BTO_Application.Service.HighSchoolService;
import com.CS319.BTO_Application.Service.TourApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/counselor")
public class CounselorController {

    private final CounselorService counselorService;
    private final HighSchoolService highschoolService;

    private final TourApplicationService tourApplicationService;
    private final FairInvitationService fairInvitationService;

    @Autowired
    public CounselorController(CounselorService counselorService, HighSchoolService highschoolService, FairInvitationController fairInvitationController,
                               TourApplicationController tourApplicationController, TourApplicationService tourApplicationService, FairInvitationService fairInvitationService) {
        this.counselorService = counselorService;
        this.highschoolService = highschoolService;
        this.tourApplicationService = tourApplicationService;
        this.fairInvitationService = fairInvitationService;
    }

    @GetMapping("tourApplications/getAll")
    public ResponseEntity<?> getAllTourApplications(String counselorEmail) {
        try {
            Counselor applyingCounselor = counselorService.getCounselorByUsername(counselorEmail);
            List<SchoolTourApplication> schoolTourApplications = tourApplicationService.getAllSchoolTourApplicationsByCounselor(applyingCounselor);
            return ResponseEntity.ok(schoolTourApplications); // return the list of schoolApplications
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour applications of counselor: " + counselorEmail);
        }
    }


    @GetMapping("fairInvitations/getAll")
    public ResponseEntity<?> getAllFairInvitations(String counselorEmail) {
        try {
            Counselor applyingCounselor = counselorService.getCounselorByUsername(counselorEmail);
            List<FairInvitation> fairInvitations = fairInvitationService.getAllFairInvitationsByCounselor(applyingCounselor);
            return ResponseEntity.ok(fairInvitations); // return the list of schoolApplications
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour invitations of counselor: " + counselorEmail);
        }    }


    @GetMapping("/{id}/feedbacks")
    public ResponseEntity<?> getCounselorFeedbacks(@PathVariable Long id) {
        try {
            Counselor counselor = counselorService.getCounselorById(id);
            return ResponseEntity.ok(counselor.getFeedbacks());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}





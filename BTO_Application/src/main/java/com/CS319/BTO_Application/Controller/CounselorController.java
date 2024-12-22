package com.CS319.BTO_Application.Controller;
//import com.CS319.BTO_Application.Service.UserService;
import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.FairInvitation;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Service.CounselorService;
import com.CS319.BTO_Application.Service.FairInvitationService;
import com.CS319.BTO_Application.Service.HighSchoolService;
import com.CS319.BTO_Application.Service.SchoolTourApplicationService;
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

    private final SchoolTourApplicationService schoolTourApplicationService;
    private final FairInvitationService fairInvitationService;

    @Autowired
    public CounselorController(CounselorService counselorService, HighSchoolService highschoolService, FairInvitationController fairInvitationController,
                               TourApplicationController tourApplicationController, SchoolTourApplicationService schoolTourApplicationService, FairInvitationService fairInvitationService) {
        this.counselorService = counselorService;
        this.highschoolService = highschoolService;
        this.schoolTourApplicationService = schoolTourApplicationService;
        this.fairInvitationService = fairInvitationService;
    }

    /**
     * Retrieves all tour applications for a specific counselor.
     *
     * Preconditions:
     * - `counselorEmail` must not be null and must correspond to an existing counselor.
     *
     * Postconditions:
     * - Returns a list of tour applications for the specified counselor.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param counselorEmail The email of the counselor.
     * @return ResponseEntity containing the list of tour applications for the specified counselor or error status.
     */
    @GetMapping("tourApplications/getAll")
    public ResponseEntity<?> getAllTourApplications(String counselorEmail) {
        try {
            Counselor applyingCounselor = counselorService.getCounselorByUsername(counselorEmail);
            List<SchoolTourApplication> schoolTourApplications = schoolTourApplicationService.getAllSchoolTourApplicationsByCounselor(applyingCounselor);
            return ResponseEntity.ok(schoolTourApplications); // return the list of schoolApplications
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour applications of counselor: " + counselorEmail);
        }
    }

    /**
     * Retrieves all fair invitations for a specific counselor.
     *
     * Preconditions:
     * - `counselorEmail` must not be null and must correspond to an existing counselor.
     *
     * Postconditions:
     * - Returns a list of fair invitations for the specified counselor.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param counselorEmail The email of the counselor.
     * @return ResponseEntity containing the list of fair invitations for the specified counselor or error status.
     */
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




}





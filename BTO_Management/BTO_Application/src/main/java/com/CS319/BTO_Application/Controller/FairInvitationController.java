
package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.AddInvitationRequest;
import com.CS319.BTO_Application.Entity.Coordinator;
import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.FairInvitation;
import com.CS319.BTO_Application.Service.CounselorService;
import com.CS319.BTO_Application.Service.FairInvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/fair-invitations")
@Controller
public class FairInvitationController {

    private final FairInvitationService fairInvitationService;
    private final CounselorService counselorService;

    @Autowired
    public FairInvitationController(FairInvitationService fairInvitationService, CounselorService counselorService) {
        this.fairInvitationService = fairInvitationService;
        this.counselorService = counselorService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllFairInvitations() {
        try {
            // Fetch all tour guides from the service
            List<FairInvitation> fairInvitations = fairInvitationService.getAllFairInvitations();
            return ResponseEntity.ok(fairInvitations); // Return the list of tour guides with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving fair invitations.");
        }
    }

    @PostMapping("/add")
    public ResponseEntity<FairInvitation> addFairInvitation(@RequestBody AddInvitationRequest invitationRequest) {
        if(counselorService.getCounselorByUsername(invitationRequest.getCounselorUsername()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by username

        return new ResponseEntity<>(fairInvitationService.addFairInvitation(invitationRequest.getFairInvitation(),invitationRequest.getCounselorUsername()), HttpStatus.CREATED);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFairInvitation(@RequestParam Long fairInvitationId) {
        if (fairInvitationService.getFairInvitationById(fairInvitationId) == null) {
            return ResponseEntity.status(400).body("Fair invitation With id "+fairInvitationId+"Not Found");
        }
        fairInvitationService.deleteById(fairInvitationId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}





package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Entity.Fair;
import com.CS319.BTO_Application.Entity.FairInvitation;
import com.CS319.BTO_Application.Service.FairService;
import com.CS319.BTO_Application.Service.FairInvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/fair")
@Controller
public class FairController {

    private final FairService fairService;
    private final FairInvitationService fairInvitationService;

    @Autowired
    public FairController(FairService fairService, FairInvitationService fairInvitationService) {
        this.fairService = fairService;
        this.fairInvitationService = fairInvitationService;
    }

    @PostMapping("/create")
    public ResponseEntity<Fair> createFair(@RequestParam Long fairInvitationId) {
        FairInvitation fairInvitation = fairInvitationService.getFairInvitationById(fairInvitationId);
        Fair fair = fairService.createFair(fairInvitation);
        fair.setFairStatus("Pending");
        return new ResponseEntity<>(fair, HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Fair>> getAllFairs() {
        try {
            List<Fair> fairs = fairService.getAllFairs();
            return ResponseEntity.ok(fairs);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PutMapping("/approve")
    public ResponseEntity<Fair> approveFair(@RequestParam Long fairId) {
        Fair fair = fairService.getFairById(fairId);
        if (!fair.getFairStatus().equals("Pending")) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(fairService.setStatusApproved(fair), HttpStatus.ACCEPTED);
    }

    @PutMapping("/reject")
    public ResponseEntity<Fair> rejectFair(@RequestParam Long fairId) {
        Fair fair = fairService.getFairById(fairId);
        if (!fair.getFairStatus().equals("Pending")) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(fairService.setStatusRejected(fair), HttpStatus.ACCEPTED);
    }

    @PutMapping("/assign-bto-member")
    public ResponseEntity<Void> assignBTOMember(@RequestParam Long fairId) {
        Fair fair = fairService.getFairById(fairId);
        fairService.setStatusBTOMemberAssigned(fair);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
}
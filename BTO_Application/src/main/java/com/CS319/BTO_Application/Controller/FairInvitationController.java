
package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.*;
import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RequestMapping("/api/fair-invitations")
@Controller
public class FairInvitationController {

    private final FairInvitationService fairInvitationService;
    private final FairService fairService;
    private final CounselorService counselorService;
    private final CoordinatorService coordinatorService;
    private final ExecutiveService executiveService;
    private final NotificationService notificationService;

    @Autowired
    public FairInvitationController(FairInvitationService fairInvitationService, CounselorService counselorService, FairService fairService, CoordinatorService coordinatorService, ExecutiveService executiveService, NotificationService notificationService) {
        this.fairInvitationService = fairInvitationService;
        this.counselorService = counselorService;
        this.fairService = fairService;
        this.coordinatorService = coordinatorService;
        this.executiveService = executiveService;
        this.notificationService = notificationService;
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
        if(fairInvitationService.existsFairInvitationByHighSchoolAndDate(invitationRequest.getFairInvitation(), invitationRequest.getCounselorUsername())){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(fairInvitationService.addFairInvitation(invitationRequest.getFairInvitation(),invitationRequest.getCounselorUsername()), HttpStatus.CREATED);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFairInvitation(@RequestParam Long fairInvitationId) {
        if (fairInvitationService.getFairInvitationById(fairInvitationId) == null) {
            return ResponseEntity.status(400).body("Fair invitation With id "+fairInvitationId+"Not Found");
        }
        fairInvitationService.deleteFairInvitationById(fairInvitationId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/counselor/cancel")
    public ResponseEntity<FairInvitation> cancelFairInvitation(@RequestParam String counselorEmail,@RequestParam Long fairInvitationId) {
        FairInvitation fairInvitation = fairInvitationService.getFairInvitationById(fairInvitationId);
        System.out.println("Fair invitation exists: " + fairInvitation);
        if (counselorService.getCounselorByUsername(counselorEmail) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        Counselor counselor = counselorService.getCounselorByUsername(counselorEmail);
        if (fairInvitation!= null) {
            if (fairInvitation.getApplyingCounselor().equals(counselor)) {
                if(fairService.getFairByInvitationId(fairInvitationId)!=null){
                    fairService.setStatusCancelled(fairService.getFairByInvitationId(fairInvitationId));
                    System.out.println("Fair invitation cancelled: " + fairInvitation);
                }

                // Notify assigned BTO Members for cancellation
                if (fairInvitation.getFairInvitationStatus().equals("Approved")) {
                    TourGuide tourGuide = fairService.getFairByInvitationId(fairInvitationId).getAssignedGuideToFair();
                    Executive executive = fairService.getFairByInvitationId(fairInvitationId).getAssignedExecutive();
                    if (tourGuide != null) {
                        notifyForFairInvitation(fairInvitation, tourGuide.getEmail(), "Guide Fair Cancelled");
                    }
                    if (executive != null) {
                        notifyForFairInvitation(fairInvitation, executive.getEmail(), "Executive Fair Cancelled");
                    }
                }

                return new ResponseEntity<>(fairInvitationService.cancelFairInvitation(counselorEmail, fairInvitationId), HttpStatus.ACCEPTED);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("/bto-manager/approve")
    public ResponseEntity<FairInvitation> approveFairInvitation(@RequestParam String btoManagerEmail,@RequestParam Long fairInvitationId) {
        FairInvitation fairInvitation = fairInvitationService.getFairInvitationById(fairInvitationId);

        if(Objects.equals(fairInvitation.getFairInvitationStatus(), "Created")){
            if (coordinatorService.getCoordinatorByEmail(btoManagerEmail) != null) {
                return new ResponseEntity<>(fairInvitationService.approveFairInvitation(btoManagerEmail, fairInvitationId), HttpStatus.ACCEPTED);
            } else if (executiveService.getExecutiveByEmail(btoManagerEmail) != null) {
                return new ResponseEntity<>(fairInvitationService.approveFairInvitation(btoManagerEmail, fairInvitationId), HttpStatus.ACCEPTED);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/bto-manager/reject")
    public ResponseEntity<FairInvitation> rejectFairInvitation(@RequestParam String btoManagerEmail,@RequestParam Long fairInvitationId) {
        FairInvitation fairInvitation = fairInvitationService.getFairInvitationById(fairInvitationId);

        if(Objects.equals(fairInvitation.getFairInvitationStatus(), "Created")) {
            if (coordinatorService.getCoordinatorByEmail(btoManagerEmail) != null) {
                // Notify Counselor for rejection
                notifyForFairInvitation(fairInvitation, fairInvitation.getApplyingCounselor().getEmail(), "Counselor Fair Rejected");
                return new ResponseEntity<>(fairInvitationService.rejectFairInvitation(btoManagerEmail, fairInvitationId), HttpStatus.ACCEPTED);
            } else if (executiveService.getExecutiveByEmail(btoManagerEmail) != null) {
                // Notify Counselor for rejection
                notifyForFairInvitation(fairInvitation, fairInvitation.getApplyingCounselor().getEmail(), "Counselor Fair Rejected");
                return new ResponseEntity<>(fairInvitationService.rejectFairInvitation(btoManagerEmail, fairInvitationId), HttpStatus.ACCEPTED);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }  else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    private void notifyForFairInvitation(FairInvitation fairInvitation, String email, String situation) {
        String title = null;
        String text = null;
        String textForBTOMember = "İptal Edilen Fuarın Bilgisi: " + "<br>" +
                "Başlangıç Zamanı: " + fairInvitation.getFairStartDate() + " - " + fairInvitation.getFairStartTime() + "<br>" +
                "Bitiş Zamanı: " + fairInvitation.getFairEndDate() + " - " + fairInvitation.getFairEndTime() +
                "Lise: " + fairInvitation.getApplyingHighschool() +"<br>" +
                "Şehir: " + fairInvitation.getApplyingHighschool().getCity();
        String textForCounselor = "Reddedilen Fuar Davetiyesinin Bilgisi: " + "<br>" +
                "Başlangıç Zamanı: " + fairInvitation.getFairStartDate() + " - " + fairInvitation.getFairStartTime() + "<br>" +
                "Bitiş Zamanı: " + fairInvitation.getFairEndDate() + " - " + fairInvitation.getFairEndTime();

        if (situation.equals("Guide Fair Cancelled")) {
            title = "Kayıtlı Olduğunuz Fuar Lise Tarafından İptal Edildi";
            text = textForBTOMember;
        }
        else if (situation.equals("Executive Fair Cancelled")) {
            title = "Kayıtlı Olduğunuz Fuar Lise Tarafından İptal Edildi";
            text = textForBTOMember;
        }
        else if (situation.equals("Counselor Fair Rejected")) {
            title = "Fuar Davetiyeniz Ne Yazık ki Reddedildi";
            text = textForCounselor;
        }

        if (title != null || text != null || email != null) {
            notificationService.createNotification(email, title, text);
        }
    }

}





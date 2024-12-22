
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

    /**
     * Adds a new fair invitation.
     *
     * Preconditions:
     * - `invitationRequest` must not be null.
     * - The counselor specified in `invitationRequest` must exist.
     * - The fair invitation must not already exist.
     *
     * Postconditions:
     * - The fair invitation is added to the repository.
     * - Returns status 201 (CREATED) if successful.
     *
     * @param invitationRequest The request containing the fair invitation details.
     * @return ResponseEntity with the created fair invitation or error status.
     */
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

    /**
     * Deletes a fair invitation by its ID.
     *
     * Preconditions:
     * - `fairInvitationId` must correspond to an existing fair invitation.
     *
     * Postconditions:
     * - Deletes the specified fair invitation.
     * - Returns status 204 (NO_CONTENT).
     *
     * @param fairInvitationId ID of the fair invitation to delete.
     * @return ResponseEntity with status 204 or error status.
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFairInvitation(@RequestParam Long fairInvitationId) {
        if (fairInvitationService.getFairInvitationById(fairInvitationId) == null) {
            return ResponseEntity.status(400).body("Fair invitation With id "+fairInvitationId+"Not Found");
        }
        fairInvitationService.deleteFairInvitationById(fairInvitationId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Cancels a fair invitation by a counselor.
     *
     * Preconditions:
     * - `counselorEmail` must correspond to an existing counselor.
     * - `fairInvitationId` must correspond to an existing fair invitation.
     *
     * Postconditions:
     * - Cancels the specified fair invitation.
     * - Notifies assigned BTO members if the fair invitation was approved.
     * - Returns status 202 (ACCEPTED) if successful.
     *
     * @param counselorEmail The email of the counselor canceling the invitation.
     * @param fairInvitationId The ID of the fair invitation to cancel.
     * @return ResponseEntity with the canceled fair invitation or error status.
     */
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

    /**
     * Approves a fair invitation by a BTO manager.
     *
     * Preconditions:
     * - `btoManagerEmail` must correspond to an existing BTO manager.
     * - `fairInvitationId` must correspond to an existing fair invitation.
     * - The fair invitation status must be "Created".
     *
     * Postconditions:
     * - Approves the specified fair invitation.
     * - Returns status 202 (ACCEPTED) if successful.
     *
     * @param btoManagerEmail The email of the BTO manager approving the invitation.
     * @param fairInvitationId The ID of the fair invitation to approve.
     * @return ResponseEntity with the approved fair invitation or error status.
     */
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

    /**
     * Rejects a fair invitation by a BTO manager.
     *
     * Preconditions:
     * - `btoManagerEmail` must correspond to an existing BTO manager.
     * - `fairInvitationId` must correspond to an existing fair invitation.
     * - The fair invitation status must be "Created".
     *
     * Postconditions:
     * - Rejects the specified fair invitation.
     * - Notifies the counselor of the rejection.
     * - Returns status 202 (ACCEPTED) if successful.
     *
     * @param btoManagerEmail The email of the BTO manager rejecting the invitation.
     * @param fairInvitationId The ID of the fair invitation to reject.
     * @return ResponseEntity with the rejected fair invitation or error status.
     */
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

    /**
     * Sends notifications related to a fair invitation.
     *
     * Preconditions:
     * - `fairInvitation` must not be null and must contain valid details.
     * - `email` must be a valid email address.
     * - `situation` must be a recognized situation type.
     *
     * Postconditions:
     * - Sends a notification to the specified email address.
     * - Generates appropriate notification content based on the situation.
     *
     * @param fairInvitation The fair invitation for which the notification is sent.
     * @param email The email address to send the notification.
     * @param situation The situation type that determines the notification content.
     */
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





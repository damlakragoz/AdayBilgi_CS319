package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Repos.BTOManagerRepos;
import com.CS319.BTO_Application.Repos.CounselorRepos;
import com.CS319.BTO_Application.Repos.FairInvitationRepos;
import com.CS319.BTO_Application.Repos.UserRepos;
import com.CS319.BTO_Application.Controller.FairController;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FairInvitationService {
    private final FairInvitationRepos fairInvitationRepos;
    private final UserRepos userRepos;
    private final CounselorRepos counselorRepos;
    private final BTOManagerRepos btoManagerRepos;
    private final FairService  fairService;



    @Autowired
    public FairInvitationService(FairInvitationRepos fairInvitationRepos, UserRepos userRepos, CounselorRepos counselorRepos, BTOManagerRepos btoManagerRepos, FairService fairService) {
        this.fairInvitationRepos = fairInvitationRepos;
        this.userRepos = userRepos;
        this.counselorRepos = counselorRepos;
        this.btoManagerRepos = btoManagerRepos;
        this.fairService = fairService;
    };
    public List<FairInvitation> getAllFairInvitations() {
        return fairInvitationRepos.findAll();
    }

    public List<FairInvitation> getAllFairInvitationsByCounselor(Counselor counselor) {
        return fairInvitationRepos.findByApplyingCounselor(counselor);
    }

    /**
     * Adds a new fair invitation.
     *
     * Preconditions:
     * - `fairInvitation` and `counselorUsername` must not be null.
     *
     * Postconditions:
     * - The fair invitation is saved in the repository.
     *
     * @param fairInvitation The fair invitation to be added.
     * @param counselorUsername The username of the counselor applying for the fair.
     * @return The added fair invitation.
     */
    public FairInvitation addFairInvitation(FairInvitation fairInvitation, String counselorUsername) {
        Counselor counselor = (Counselor)userRepos.findByEmail(counselorUsername);
        fairInvitation.setApplyingCounselor(counselor);
        fairInvitation.setApplyingHighschool(counselor.getHighSchool());
        fairInvitation.setFairInvitationStatus("Created");
        fairInvitation.setFairStartDate(fairInvitation.getFairStartDate());
        fairInvitation.setFairEndDate(fairInvitation.getFairEndDate());
        fairInvitation.setFairStartTime(fairInvitation.getFairStartTime());
        fairInvitation.setFairEndTime(fairInvitation.getFairEndTime());
        return fairInvitationRepos.save(fairInvitation);
    }

    public void deleteFairInvitationById(Long fairInvitationId) {
        if (fairInvitationRepos.existsById(fairInvitationId)) {
            fairInvitationRepos.deleteById(fairInvitationId);
        }
        else{
            System.out.println("Fair Invitation Not Found " );
        }
    }

    public FairInvitation getFairInvitationById(Long fairInvitationId) {
        if(!fairInvitationRepos.existsById(fairInvitationId)){
            System.out.println("Fair inv Not Found with id " + fairInvitationId);
            return null;
        }
        return fairInvitationRepos.findById(fairInvitationId).get();
    }

    /*
    @Transactional
    public void processFairInvitation() {
        LocalDateTime now = LocalDateTime.now(); // Şu anki zaman

        // Basit query ile başvuruları al
        List<FairInvitation> invitations = fairInvitationRepos.findByStatusAndTransitionTime("Created", now);

        // Benzersiz ve tekrarlı başvuruları oluşturmak için Map
        Map<String, FairInvitation> uniqueInvitationsMap = new HashMap<>();
        List<FairInvitation> nonUniqueInvitations = new ArrayList<>();

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        for (FairInvitation invitation : invitations) {
            // Handle null values for time and dates
            String startDate = invitation.getFairStartDate() != null ? invitation.getFairStartDate().toString() : "null";
            String endDate = invitation.getFairEndDate() != null ? invitation.getFairEndDate().toString() : "null";
            String startTime = invitation.getFairStartTime() != null ? invitation.getFairStartTime().format(timeFormatter) : "null";
            String endTime = invitation.getFairEndTime() != null ? invitation.getFairEndTime().format(timeFormatter) : "null";

            // Unique key based on school_id + dates + times
            String key = invitation.getApplyingHighschool().getId() + "-" +
                    startDate + "-" + endDate + "-" + startTime + "-" + endTime;

            if (uniqueInvitationsMap.containsKey(key)) {
                nonUniqueInvitations.add(invitation);
            } else {
                uniqueInvitationsMap.put(key, invitation); // Add unique invitation
            }
        }


        // Benzersiz başvuruları liste olarak al
        List<FairInvitation> uniqueInvitations = new ArrayList<>(uniqueInvitationsMap.values());

        // Unique başvuruları log'a yaz
        for (FairInvitation invitation : uniqueInvitations) {
            System.out.println("Unique invitation: " + invitation.getFairStartDate() + " | " + invitation.getFairInvitationStatus());
            fairInvitationRepos.save(invitation);
        }

        // Non-unique başvuruları sil
        for (FairInvitation invitation : nonUniqueInvitations) {
            System.out.println("Deleting non-unique invitation: " + invitation.getId());
            invitation.setFairInvitationStatus("Cancelled");
        }
        System.out.println("Deleted " + nonUniqueInvitations.size() + " non-unique invitations.");

    }

     */

    public FairInvitation setStatusPending(FairInvitation fairInvitation) {
        fairInvitation.setFairInvitationStatus("Pending");
        return fairInvitationRepos.save(fairInvitation);
    }

    public FairInvitation setStatusApproved(FairInvitation fairInvitation) {
        fairInvitation.setFairInvitationStatus("Approved");
        return fairInvitationRepos.save(fairInvitation);
    }

    public FairInvitation setStatusCancelled(FairInvitation fairInvitation) {
        fairInvitation.setFairInvitationStatus("Cancelled");
        return fairInvitationRepos.save(fairInvitation);
    }

    /**
     * Checks if a fair invitation exists by high school and date.
     *
     * Preconditions:
     * - `fairInvitation` and `counselorEmail` must not be null.
     *
     * Postconditions:
     * - Returns true if a fair invitation exists with the specified high school and date, otherwise false.
     *
     * @param fairInvitation The fair invitation to check.
     * @param counselorEmail The email of the counselor.
     * @return True if a fair invitation exists, otherwise false.
     */
    public boolean existsFairInvitationByHighSchoolAndDate(FairInvitation fairInvitation, String counselorEmail) {
        if(!counselorRepos.existsByEmail(counselorEmail)){
            return false;
        }
        Counselor counselor  = counselorRepos.findByEmail(counselorEmail);
        HighSchool applyingHighSchool = counselor.getHighSchool();
        if(fairInvitationRepos.existsByFairStartDateAndFairEndDateAndApplyingHighschoolAndFairInvitationStatus
                (fairInvitation.getFairStartDate(), fairInvitation.getFairEndDate(), applyingHighSchool,"Created")
         || fairInvitationRepos.existsByFairStartDateAndFairEndDateAndApplyingHighschoolAndFairInvitationStatus
                (fairInvitation.getFairStartDate(), fairInvitation.getFairEndDate(), applyingHighSchool,"Pending")
        || fairInvitationRepos.existsByFairStartDateAndFairEndDateAndApplyingHighschoolAndFairInvitationStatus
                (fairInvitation.getFairStartDate(), fairInvitation.getFairEndDate(), applyingHighSchool,"Approved")
        || fairInvitationRepos.existsByFairStartDateAndFairEndDateAndApplyingHighschoolAndFairInvitationStatus
                (fairInvitation.getFairStartDate(), fairInvitation.getFairEndDate(), applyingHighSchool,"Rejected")
        || fairInvitationRepos.existsByFairStartDateAndFairEndDateAndApplyingHighschoolAndFairInvitationStatus
                (fairInvitation.getFairStartDate(), fairInvitation.getFairEndDate(), applyingHighSchool,"Finished")){
            return true;
        }
        return false;
    }

    /**
     * Cancels a fair invitation.
     *
     * Preconditions:
     * - `counselorEmail` and `fairInvitationID` must not be null.
     *
     * Postconditions:
     * - The fair invitation status is updated to "Cancelled".
     * - The fair invitation is saved in the repository.
     *
     * @param counselorEmail The email of the counselor canceling the invitation.
     * @param fairInvitationID The ID of the fair invitation to cancel.
     * @return The canceled fair invitation.
     */
    public FairInvitation cancelFairInvitation(String counselorEmail, Long fairInvitationID) {
        if(!counselorRepos.existsByEmail(counselorEmail)){
            throw new EntityNotFoundException("Counselor not found with email: " + counselorEmail);
        }
        if(!fairInvitationRepos.existsById(fairInvitationID)) {
            System.out.println("Fair Invitation Not Found");
        }
        FairInvitation fairInvitation = getFairInvitationById(fairInvitationID);
        setStatusCancelled(fairInvitation);
        fairInvitationRepos.save(fairInvitation);
        return fairInvitation;
    }

    /**
     * Rejects a fair invitation.
     *
     * Preconditions:
     * - `BTOManagerEmail` and `fairInvitationID` must not be null.
     *
     * Postconditions:
     * - The fair invitation status is updated to "Rejected".
     * - The fair invitation is saved in the repository.
     *
     * @param BTOManagerEmail The email of the BTO manager rejecting the invitation.
     * @param fairInvitationID The ID of the fair invitation to reject.
     * @return The rejected fair invitation.
     */
    public FairInvitation rejectFairInvitation(String BTOManagerEmail, Long fairInvitationID) {
        if(!btoManagerRepos.existsByEmail(BTOManagerEmail)){
            throw new EntityNotFoundException("BTO Manager not found with email: " + BTOManagerEmail);
        }
        if(!fairInvitationRepos.existsById(fairInvitationID)) {
            System.out.println("Fair Invitation Not Found");
        }
        FairInvitation fairInvitation = getFairInvitationById(fairInvitationID);
        fairInvitation.setFairInvitationStatus("Rejected");
        fairInvitationRepos.save(fairInvitation);
        System.out.println("Fair Invitation Rejected");
        return fairInvitation;
    }

    /**
     * Approves a fair invitation.
     *
     * Preconditions:
     * - `BTOManagerEmail` and `fairInvitationID` must not be null.
     *
     * Postconditions:
     * - The fair invitation status is updated to "Pending".
     * - A fair is created for the approved invitation.
     * - The fair invitation is saved in the repository.
     *
     * @param BTOManagerEmail The email of the BTO manager approving the invitation.
     * @param fairInvitationID The ID of the fair invitation to approve.
     * @return The approved fair invitation.
     */
    public FairInvitation approveFairInvitation(String BTOManagerEmail, Long fairInvitationID) {
        if(!btoManagerRepos.existsByEmail(BTOManagerEmail)){
            throw new EntityNotFoundException("BTO Manager not found with email: " + BTOManagerEmail);
        }
        if(!fairInvitationRepos.existsById(fairInvitationID)) {
            System.out.println("Fair Invitation Not Found");
        }
        FairInvitation fairInvitation = getFairInvitationById(fairInvitationID);
        fairInvitation.setFairInvitationStatus("Pending");
        fairInvitationRepos.save(fairInvitation);

        // Create a fair for the approved invitation
        createFair(fairInvitation);
        System.out.println("Fair created for approved invitation: " + fairInvitationID);
        return fairInvitation;
    }

    /**
     * Creates a fair for a given fair invitation.
     *
     * Preconditions:
     * - `fairInvitation` must not be null.
     *
     * Postconditions:
     * - A fair is created and saved in the repository.
     *
     * @param fairInvitation The fair invitation to create a fair for.
     */
    public void createFair(FairInvitation fairInvitation) {
        LocalDate startDate = fairInvitation.getFairStartDate();
        LocalDate endDate = fairInvitation.getFairEndDate();
        LocalTime startTime = fairInvitation.getFairStartTime();
        LocalTime endTime = fairInvitation.getFairEndTime();
        HighSchool applyingHighschool = fairInvitation.getApplyingHighschool();
        Fair fair = new Fair(startDate, endDate, "Pending", applyingHighschool, fairInvitation,startTime, endTime, 0.0);
        fairService.saveFair(fair, fairInvitation);
    }


}


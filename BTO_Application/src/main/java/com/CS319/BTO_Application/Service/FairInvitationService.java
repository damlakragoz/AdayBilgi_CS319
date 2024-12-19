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

    public FairInvitation addFairInvitation(FairInvitation fairInvitation, String counselorUsername) {
        Counselor counselor = (Counselor)userRepos.findByEmail(counselorUsername);
        fairInvitation.setApplyingCounselor(counselor);
        fairInvitation.setApplyingHighschool(counselor.getHighSchool());
        fairInvitation.setFairInvitationStatus("Created");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime batchWindow = now.withSecond(0).withNano(0).plusMinutes(1);
        fairInvitation.setTransitionTime(batchWindow);
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

    public void createFair(FairInvitation fairInvitation) {
        LocalDate startDate = fairInvitation.getFairStartDate();
        LocalDate endDate = fairInvitation.getFairEndDate();
        LocalTime startTime = fairInvitation.getFairStartTime();
        LocalTime endTime = fairInvitation.getFairEndTime();
        HighSchool applyingHighschool = fairInvitation.getApplyingHighschool();
        // Fair(LocalDate startDate, LocalDate endDate, String fairStatus, HighSchool applyingHighschool, FairInvitation fairInvitation, LocalTime startTime, LocalTime endTime)
        Fair fair = new Fair(startDate, endDate, "Pending", applyingHighschool, fairInvitation, startTime, endTime);
        fairService.saveFair(fair, fairInvitation);
    }
}


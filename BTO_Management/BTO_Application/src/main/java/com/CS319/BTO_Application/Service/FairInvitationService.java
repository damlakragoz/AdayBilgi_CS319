package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.FairInvitation;
import com.CS319.BTO_Application.Repos.FairInvitationRepos;
import com.CS319.BTO_Application.Repos.UserRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FairInvitationService {
    private final FairInvitationRepos fairInvitationRepos;
    private final UserRepos userRepos;

    @Autowired
    public FairInvitationService(FairInvitationRepos fairInvitationRepos, UserRepos userRepos) {
        this.fairInvitationRepos = fairInvitationRepos;
        this.userRepos = userRepos;
    };
    public List<FairInvitation> getAllFairInvitations() {
        return fairInvitationRepos.findAll();
    }

    public FairInvitation addFairInvitation(FairInvitation fairInvitation, String counselorUsername) {
        Counselor counselor = (Counselor)userRepos.findByEmail(counselorUsername);
        fairInvitation.setApplyingCounselor(counselor);
        return fairInvitationRepos.save(fairInvitation);
    }

    public void deleteById(Long fairInvitationId) {
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

}


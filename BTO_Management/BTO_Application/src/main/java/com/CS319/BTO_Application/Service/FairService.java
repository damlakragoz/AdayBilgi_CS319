package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Repos.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FairService {
    private final FairRepos fairRepos;
    private final FairInvitationRepos fairInvitationRepos;
    private final TourGuideRepos tourGuideRepos;
    private final CoordinatorRepos coordinatorRepos;
    private final ExecutiveRepos executiveRepos;

    @Autowired
    public FairService(FairRepos fairRepos, FairInvitationRepos fairInvitationRepos, TourGuideRepos tourGuideRepos, CoordinatorRepos coordinatorRepos, ExecutiveRepos executiveRepos) {
        this.fairRepos = fairRepos;
        this.fairInvitationRepos = fairInvitationRepos;
        this.tourGuideRepos = tourGuideRepos;
        this.coordinatorRepos = coordinatorRepos;
        this.executiveRepos = executiveRepos;
    }

    public Fair createFair(FairInvitation fairInvitation) {
        Fair fair = new Fair();
        fair.setFairInvitation(fairInvitation);
        fair.setFairStatus("Pending");
        return fairRepos.save(fair);
    }

    public Fair setStatusApproved(Fair fair) {
        fair.setFairStatus("Approved");
        return fairRepos.save(fair);
    }

    public Fair setStatusRejected(Fair fair) {
        fair.setFairStatus("Rejected");
        return fairRepos.save(fair);
    }

    public Fair getFairById(Long fairId) {
        return fairRepos.findById(fairId)
                .orElseThrow(() -> new EntityNotFoundException("Fair not found with id: " + fairId));
    }

    public void setStatusBTOMemberAssigned(Fair fair) {
        fair.setFairStatus("BTOMemberAssigned");
        fairRepos.save(fair);
    }

    public List<Fair> getAllFairs() {
        return fairRepos.findAll();
    }
}

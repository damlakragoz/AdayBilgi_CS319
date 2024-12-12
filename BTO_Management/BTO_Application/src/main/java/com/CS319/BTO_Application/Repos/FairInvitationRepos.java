package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.FairInvitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FairInvitationRepos extends JpaRepository<FairInvitation, Long> {
    List<FairInvitation> findByApplyingCounselor(Counselor counselor);
}


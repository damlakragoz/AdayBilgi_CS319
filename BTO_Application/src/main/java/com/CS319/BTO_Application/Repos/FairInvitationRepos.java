package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.FairInvitation;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface FairInvitationRepos extends JpaRepository<FairInvitation, Long> {
    List<FairInvitation> findByApplyingCounselor(Counselor counselor);


    @Query("SELECT a FROM FairInvitation a WHERE a.fairInvitationStatus = :fairInvitationStatus AND a.transitionTime <= :time")
    List<FairInvitation> findByStatusAndTransitionTime(@Param("fairInvitationStatus") String status, @Param("time") LocalDateTime time);

    @Query("SELECT ta FROM FairInvitation ta WHERE ta.fairStartDate = :fairStartDate AND ta.fairEndDate = :fairEndDate")
    FairInvitation findBySelectedDates(@Param("fairStartDate") LocalDate fairStartDate, @Param("fairEndDate") LocalDate fairEndDate);
}



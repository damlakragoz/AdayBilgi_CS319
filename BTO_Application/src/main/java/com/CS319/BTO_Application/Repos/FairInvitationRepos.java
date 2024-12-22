package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface FairInvitationRepos extends JpaRepository<FairInvitation, Long> {
    List<FairInvitation> findByApplyingCounselor(Counselor counselor);

    boolean existsByFairStartDateAndFairEndDateAndApplyingHighschoolAndFairInvitationStatus(
            LocalDate fairStartDate,
            LocalDate fairEndDate,
            HighSchool applyingHighschool,
            String fairInvitationStatus
    );
    @Query("SELECT ta FROM FairInvitation ta WHERE ta.fairStartDate = :fairStartDate AND ta.fairEndDate = :fairEndDate")
    FairInvitation findBySelectedDates(@Param("fairStartDate") LocalDate fairStartDate, @Param("fairEndDate") LocalDate fairEndDate);
}



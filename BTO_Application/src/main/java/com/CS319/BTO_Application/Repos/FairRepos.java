package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Fair;
import com.CS319.BTO_Application.Entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FairRepos extends JpaRepository<Fair, Long> {
    Fair findByFairInvitationId(Long fairInvitationId);

    @Query("SELECT t FROM Fair t WHERE MONTH(t.startDate) = :month AND YEAR(t.startDate) = :year")
    List<Fair> findFairsByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT t FROM Fair t WHERE MONTH(t.startDate) = :month AND YEAR(t.startDate) = :year AND t.fairStatus = 'Finished'")
    List<Fair> findFinishedFairsByMonthAndYear(@Param("month") int month, @Param("year") int year);
}

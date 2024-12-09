
package com.CS319.BTO_Application.Repos;
import com.CS319.BTO_Application.Entity.TimeSlot;
import com.CS319.BTO_Application.Entity.TourApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;


public interface TourApplicationRepos<T extends TourApplication> extends JpaRepository<T, Long> {
    Optional<T> findById(Long id);

    @Query("SELECT ta FROM TourApplication ta WHERE ta.applicationStatus = :status AND ta.transitionTime <= :now")
    List<TourApplication> findByStatusAndTransitionTime(@Param("status") String status, @Param("now") LocalDateTime now);

    @Query("SELECT ta FROM TourApplication ta WHERE ta.selectedDate = :selectedDate AND ta.selectedTimeSlot = :selectedTimeSlot")
    TourApplication findBySelectedDateAndSelectedTimeSlot(@Param("selectedDate") LocalDateTime selectedDate,
                                                          @Param("selectedTimeSlot") TimeSlot selectedTimeSlot);

}



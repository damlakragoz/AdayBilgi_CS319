package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.IndividualTourApplication;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface IndividualTourApplicationRepos extends TourApplicationRepos<IndividualTourApplication> {

    @Query("SELECT a FROM IndividualTourApplication a WHERE a.applicationStatus = :status AND a.transitionTime <= :time")
    List<IndividualTourApplication> findIndByStatusAndTransitionTime(@Param("status") String status, @Param("time") LocalDateTime time);

    @Query("SELECT ta FROM IndividualTourApplication ta WHERE ta.selectedDate = :selectedDate AND ta.selectedTimeSlot = :selectedTimeSlot")
    IndividualTourApplication findIndBySelectedDateAndSelectedTimeSlot(@Param("selectedDate") LocalDate selectedDate,
                                                          @Param("selectedTimeSlot") TimeSlot selectedTimeSlot);

    @Query("SELECT ta FROM SchoolTourApplication ta " +
            "WHERE ta.selectedDate = :selectedDate " +
            "AND ta.selectedTimeSlot = :selectedTimeSlot " +
            "AND ta.applicationStatus = :applicationStatus")
    IndividualTourApplication findIndBySelectedDateAndSelectedTimeSlotAndStatus(
            @Param("selectedDate") LocalDate selectedDate,
            @Param("selectedTimeSlot") TimeSlot selectedTimeSlot,
            @Param("applicationStatus") String applicationStatus);
}

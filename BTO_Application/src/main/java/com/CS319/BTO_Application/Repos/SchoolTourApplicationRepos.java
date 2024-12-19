package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface SchoolTourApplicationRepos extends TourApplicationRepos<SchoolTourApplication> {
    List<SchoolTourApplication> findByApplyingCounselor(Counselor counselor);

    @Query("SELECT a FROM SchoolTourApplication a WHERE a.applicationStatus = :status AND a.transitionTime <= :time")
    List<SchoolTourApplication> findByStatusAndTransitionTime(@Param("status") String status, @Param("time") LocalDateTime time);

    @Query("SELECT ta FROM SchoolTourApplication ta " +
            "WHERE ta.selectedDate = :selectedDate " +
            "AND ta.selectedTimeSlot = :selectedTimeSlot " +
            "AND ta.applicationStatus = :applicationStatus")
    SchoolTourApplication findBySelectedDateAndSelectedTimeSlotAndStatus(
            @Param("selectedDate") LocalDate selectedDate,
            @Param("selectedTimeSlot") TimeSlot selectedTimeSlot,
            @Param("applicationStatus") String applicationStatus);

    boolean existsBySelectedDateAndApplyingHighschoolAndApplicationStatus(LocalDate selectedDate, HighSchool highSchool, String applicationStatus);
}

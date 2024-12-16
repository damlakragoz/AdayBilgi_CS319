package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SchoolTourRepos extends JpaRepository<Tour, Long> {
    Tour findByTourApplicationId(Long tourApplicationId);

    @Query("SELECT t FROM Tour t WHERE MONTH(t.chosenDate) = :month AND YEAR(t.chosenDate) = :year")
    List<Tour> findToursByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT t FROM Tour t WHERE MONTH(t.chosenDate) = :month AND YEAR(t.chosenDate) = :year AND t.tourStatus = 'Finished'")
    List<Tour> findFinishedToursByMonthAndYear(@Param("month") int month, @Param("year") int year);
}
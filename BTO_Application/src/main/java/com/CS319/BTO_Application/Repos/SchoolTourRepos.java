package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolTourRepos extends JpaRepository<Tour, Long> {
    Tour findByTourApplicationId(Long tourApplicationId);
}

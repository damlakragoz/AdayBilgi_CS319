package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Advisor;
import com.CS319.BTO_Application.Entity.TourGuide;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdvisorRepos extends UserRepos<Advisor>{

    @Query("SELECT c FROM Advisor c")
    List<Advisor> findAllAdvisors();
}

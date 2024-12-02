package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.TourGuide;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TourGuideRepos extends UserRepos<TourGuide> {

    @Query("SELECT c FROM TourGuide c")
    List<TourGuide> findAllTourGuides();

}

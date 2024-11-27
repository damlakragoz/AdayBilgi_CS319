package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Entity.TourApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SchoolTourApplicationRepos extends JpaRepository<SchoolTourApplication, Long> {
    List<SchoolTourApplication> findByApplyingCounselor(Counselor counselor);
}

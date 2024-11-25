
package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Entity.TourApplication;
import com.CS319.BTO_Application.Repos.TourApplicationRepository;
import com.CS319.BTO_Application.Repos.UserRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TourApplicationService {
    private final TourApplicationRepository tourApplicationRepository;
    private final UserRepos userRepos;

    @Autowired
    public TourApplicationService(TourApplicationRepository tourApplicationRepository, UserRepos userRepos) {
        this.tourApplicationRepository = tourApplicationRepository;
        this.userRepos = userRepos;
    }

    public SchoolTourApplication addSchoolApplication(SchoolTourApplication tourApplication, Counselor counselor) {
        tourApplication.setApplyingCounselor(counselor);
        return tourApplicationRepository.save(tourApplication);
    }

    public List<TourApplication> getAllTourApplications() {
        return tourApplicationRepository.findAll();
    }

    
}



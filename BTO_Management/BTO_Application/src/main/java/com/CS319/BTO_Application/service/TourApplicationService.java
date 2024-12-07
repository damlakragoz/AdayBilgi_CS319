
package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.HighSchool;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Entity.TourApplication;
import com.CS319.BTO_Application.Repos.SchoolTourApplicationRepos;
import com.CS319.BTO_Application.Repos.TourApplicationRepos;
import com.CS319.BTO_Application.Repos.UserRepos;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TourApplicationService {
    private final TourApplicationRepos tourApplicationRepository;
    private final UserRepos userRepos;
    private final SchoolTourApplicationRepos schoolTourApplicationRepos;

    @Autowired
    public TourApplicationService(TourApplicationRepos tourApplicationRepository, UserRepos userRepos, SchoolTourApplicationRepos schoolTourApplicationRepos) {
        this.tourApplicationRepository = tourApplicationRepository;
        this.userRepos = userRepos;
        this.schoolTourApplicationRepos = schoolTourApplicationRepos;
    }

    /*
    Change:
        these tour applications will be saved to the SchoolTourApplicationRepos
     */
    public SchoolTourApplication addSchoolApplication(SchoolTourApplication schoolTourApplication, String counselorEmail) {
        Counselor counselor = (Counselor)userRepos.findByEmail(counselorEmail);
        schoolTourApplication.setApplyingCounselor(counselor);
        schoolTourApplication.setApplyingHighschool(counselor.getHighSchool());
        schoolTourApplication.setApplicationStatus("Pending");
        return schoolTourApplicationRepos.save(schoolTourApplication);
    }

    public List<TourApplication> getAllTourApplications() {
        return tourApplicationRepository.findAll();
    }

    public List<SchoolTourApplication> getAllSchoolTourApplicationsByCounselor(Counselor counselor) {
        return schoolTourApplicationRepos.findByApplyingCounselor(counselor);
    }

    public SchoolTourApplication getSchoolTourApplicationById(Long tourApplicationId) {
        return schoolTourApplicationRepos.findById(tourApplicationId)
                .orElseThrow(() -> new EntityNotFoundException("SchoolTourApplication not found with id: " + tourApplicationId));
    }

    /*
        not sure if saving again is the best practice

    public SchoolTourApplication changeApplicationStatus(SchoolTourApplication schoolTourApplication, String status) {
        schoolTourApplication.setApplicationStatus(status);
        return schoolTourApplicationRepos.save(schoolTourApplication);
    }

     */

    public void deleteById(Long tourApplicationId) {
        if(tourApplicationRepository.existsById(tourApplicationId)) {
            tourApplicationRepository.deleteById(tourApplicationId);
        }
        else{
            System.out.println("Tour Application Not Found");
        }
    }


}



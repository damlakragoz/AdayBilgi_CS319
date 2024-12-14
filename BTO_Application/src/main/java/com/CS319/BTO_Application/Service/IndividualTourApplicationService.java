package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.HighSchool;
import com.CS319.BTO_Application.Entity.IndividualTourApplication;
import com.CS319.BTO_Application.Repos.HighschoolRepos;
import com.CS319.BTO_Application.Repos.IndividualTourApplicationRepos;
import com.CS319.BTO_Application.Repos.UserRepos;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IndividualTourApplicationService {
    private final UserRepos userRepos;
    private final IndividualTourApplicationRepos individualTourApplicationRepos;
    private final HighschoolRepos highschoolRepos;

    public IndividualTourApplicationService(UserRepos userRepos, IndividualTourApplicationRepos individualTourApplicationRepos, HighschoolRepos highschoolRepos) {
        this.userRepos = userRepos;
        this.individualTourApplicationRepos = individualTourApplicationRepos;
        this.highschoolRepos = highschoolRepos;
    }

    public IndividualTourApplication addIndividualApplication(IndividualTourApplication tourApplication, String schoolName) {
        HighSchool school = highschoolRepos.findBySchoolName(schoolName);
        tourApplication.setApplyingHighschool(school);
        tourApplication.setApplicationStatus("Pending");
        return individualTourApplicationRepos.save(tourApplication);
    }

    public List<IndividualTourApplication> getAllIndividualTourApplications() {
        return individualTourApplicationRepos.findAll();
    }

    public Optional<IndividualTourApplication> getIndividualTourApplicationById(Long tourApplicationId) {
        if(!individualTourApplicationRepos.existsById(tourApplicationId)){
            System.out.println("Ind application Not Found with username " + tourApplicationId);
            return Optional.empty();
        }
        return individualTourApplicationRepos.findById(tourApplicationId);
    }

    public void deleteIndividualTourApplicationById(Long individualTourApplicationId) {
        if(individualTourApplicationRepos.existsById(individualTourApplicationId)) {
            individualTourApplicationRepos.deleteById(individualTourApplicationId);
        }
        else{
            System.out.println("Individual Tour Application Not Found");
        }
    }
}
package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Repos.HighschoolRepos;
import com.CS319.BTO_Application.Repos.IndividualTourApplicationRepos;
import com.CS319.BTO_Application.Repos.UserRepos;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    public IndividualTourApplication addIndividualApplication(IndividualTourApplication tourApplication) {
        tourApplication.setApplicationStatus("Created");

        // Şu anki zamanı al
        LocalDateTime now = LocalDateTime.now();

        // İşlem penceresini 2 dakika sonrası olarak ayarla
        LocalDateTime batchWindow = now.withSecond(0).withNano(0).plusMinutes(1);

        tourApplication.setTransitionTime(batchWindow);


        return individualTourApplicationRepos.save(tourApplication);
    }


    public List<IndividualTourApplication> getAllIndividualTourApplications() {
        return individualTourApplicationRepos.findAll();
    }

    /*
    public Optional<IndividualTourApplication> getIndividualTourApplicationById(Long tourApplicationId) {
        if(!individualTourApplicationRepos.existsById(tourApplicationId)){
            System.out.println("Ind application Not Found with username " + tourApplicationId);
            return Optional.empty();
        }
        return individualTourApplicationRepos.findById(tourApplicationId);
    }

     */
    public IndividualTourApplication getIndividualTourApplicationById(Long tourApplicationId) {
        return individualTourApplicationRepos.findById(tourApplicationId)
                .orElseThrow(() -> new EntityNotFoundException("Individual Tour Application not found with id: " + tourApplicationId));
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
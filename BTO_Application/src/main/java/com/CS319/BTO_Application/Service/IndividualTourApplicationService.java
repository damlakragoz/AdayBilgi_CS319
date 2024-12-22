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

    /**
     * Adds a new individual tour application to the repository.
     *
     * Preconditions:
     * - The `tourApplication` object must not be null.
     *
     * Postconditions:
     * - The application status is set to "Created".
     * - The transition time is set to a batch window 1 minute into the future.
     * - The application time is set to the current time.
     * - The tour application is saved to the repository.
     *
     * @param tourApplication The individual tour application to add.
     * @return The saved individual tour application.
     */
    public IndividualTourApplication addIndividualApplication(IndividualTourApplication tourApplication) {
        tourApplication.setApplicationStatus("Created");

        // Şu anki zamanı al
        LocalDateTime now = LocalDateTime.now();

        // İşlem penceresini 2 dakika sonrası olarak ayarla
        LocalDateTime batchWindow = now.withSecond(0).withNano(0).plusMinutes(1);

        tourApplication.setTransitionTime(batchWindow);
        tourApplication.setApplicationTime(now);


        return individualTourApplicationRepos.save(tourApplication);
    }

    /**
     * Retrieves all individual tour applications.
     *
     * @return A list of all individual tour applications.
     */
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

    /**
     * Retrieves an individual tour application by its ID.
     *
     * Preconditions:
     * - The provided `tourApplicationId` must exist in the repository.
     *
     * Postconditions:
     * - If the application exists, it is returned.
     * - If the application does not exist, an exception is thrown.
     *
     * @param tourApplicationId The ID of the individual tour application.
     * @return The individual tour application with the specified ID.
     * @throws EntityNotFoundException If the application is not found.
     */
    public IndividualTourApplication getIndividualTourApplicationById(Long tourApplicationId) {
        return individualTourApplicationRepos.findById(tourApplicationId)
                .orElseThrow(() -> new EntityNotFoundException("Individual Tour Application not found with id: " + tourApplicationId));
    }

    /**
     * Deletes an individual tour application by its ID.
     *
     * Preconditions:
     * - The provided `individualTourApplicationId` must exist in the repository.
     *
     * Postconditions:
     * - If the application exists, it is deleted.
     * - If the application does not exist, a message is logged.
     *
     * @param individualTourApplicationId The ID of the individual tour application to delete.
     */
    public void deleteIndividualTourApplicationById(Long individualTourApplicationId) {
        if(individualTourApplicationRepos.existsById(individualTourApplicationId)) {
            individualTourApplicationRepos.deleteById(individualTourApplicationId);
        }
        else{
            System.out.println("Individual Tour Application Not Found");
        }
    }
}
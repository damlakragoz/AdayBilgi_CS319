package com.CS319.BTO_Application.Service;
import com.CS319.BTO_Application.Service.TourApplicationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class TourApplicationProcessor {

    private final TourApplicationService tourApplicationService;

    public TourApplicationProcessor(TourApplicationService tourApplicationService) {
        this.tourApplicationService = tourApplicationService;
    }

    /**
     * Scheduled task for processing individual tour applications.
     *
     * Preconditions:
     * - The `TourApplicationService` must be properly configured and accessible.
     *
     * Postconditions:
     * - Processes individual tour applications, updating their statuses as needed.
     *
     * Execution:
     * - Executes every 10 seconds.
     */
    @Scheduled(fixedRate = 10000) // Executes every 10 seconds
    public void scheduleProcessIndividualTourApplications() {
        tourApplicationService.processIndividualTourApplications();
    }

    /**
     * Scheduled task for processing school tour applications.
     *
     * Preconditions:
     * - The `TourApplicationService` must be properly configured and accessible.
     *
     * Postconditions:
     * - Processes school tour applications, updating their statuses as needed.
     *
     * Execution:
     * - Executes every 5 seconds.
     */
    @Scheduled(fixedRate = 5000) // Executes every 5 seconds
    public void scheduleProcessSchoolTourApplications() {
        tourApplicationService.processSchoolTourApplications(); // Delegate logic
    }
}

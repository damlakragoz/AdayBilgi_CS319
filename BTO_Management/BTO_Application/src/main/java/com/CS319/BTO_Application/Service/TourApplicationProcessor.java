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
    @Scheduled(fixedRate = 10000) // Executes every 10 seconds
    public void scheduleProcessTourApplications() {
        tourApplicationService.processTourApplications(); // Delegate logic
    }
}
package com.CS319.BTO_Application.Service;
import com.CS319.BTO_Application.Entity.Tour;
import com.CS319.BTO_Application.Entity.TourApplication;
import com.CS319.BTO_Application.Repos.SchoolTourRepos;
import com.CS319.BTO_Application.Repos.TourApplicationRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class TourCancellationTask {

    private final SchoolTourRepos tourRepository;
    private final TourApplicationRepos tourApplicationRepos;

    @Autowired
    public TourCancellationTask(SchoolTourRepos tourRepository, TourApplicationRepos tourApplicationRepos) {
        this.tourRepository = tourRepository;
        this.tourApplicationRepos = tourApplicationRepos;
    }

    /*
        it finds the tours to cancel if the current date is 2 days prior to the tourdate and no guide is found(even no advisor)
     */
    //@Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    @Scheduled(fixedRate = 10000)
    public void cancelUnenrolledTours() {

        System.out.println("Tour cancellation");

        LocalDate dateThreshold = LocalDate.now().plusDays(2);
        tourRepository.findToursToCancel(dateThreshold);
        List<Tour> toursToCancel = tourRepository.findToursToCancel(dateThreshold);
        for(Tour tour : toursToCancel) {
            System.out.println("we have tours to cancel");
            tour.setTourStatus("Rejected");
            tour.getTourApplication().setApplicationStatus("Rejected");
            tourApplicationRepos.save(tour.getTourApplication());
        }
        tourRepository.saveAll(toursToCancel);
    }
}

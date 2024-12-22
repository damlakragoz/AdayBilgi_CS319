package com.CS319.BTO_Application.Service;
import com.CS319.BTO_Application.Entity.Advisor;
import com.CS319.BTO_Application.Entity.Tour;
import com.CS319.BTO_Application.Entity.TourApplication;
import com.CS319.BTO_Application.Repos.AdvisorRepos;
import com.CS319.BTO_Application.Repos.SchoolTourRepos;
import com.CS319.BTO_Application.Repos.TourApplicationRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Component
public class TourCancellationTask {

    private final SchoolTourRepos tourRepository;
    private final TourApplicationRepos tourApplicationRepos;
    private final AdvisorRepos advisorRepos;
    private final SchoolTourRepos schoolTourRepos;
    private final AdvisorService advisorService;

    @Autowired
    public TourCancellationTask(SchoolTourRepos tourRepository, TourApplicationRepos tourApplicationRepos, AdvisorRepos advisorRepos, SchoolTourRepos schoolTourRepos, AdvisorService advisorService) {
        this.tourRepository = tourRepository;
        this.tourApplicationRepos = tourApplicationRepos;
        this.advisorRepos = advisorRepos;
        this.schoolTourRepos = schoolTourRepos;
        this.advisorService = advisorService;
    }

    /**
     * Cancels tours that are within 2 days of their scheduled date and do not have any assigned guides or advisors.
     *
     * Preconditions:
     * - The current date is used to determine the tours close to their scheduled date.
     * - The tour must have no assigned guide or advisor.
     *
     * Postconditions:
     * - Updates the tour status to "Rejected".
     * - Updates the associated tour application status to "Rejected".
     */
    public void cancelUnenrolledTours() {

        System.out.println("Tour cancellation");

        LocalDate dateThreshold = LocalDate.now().plusDays(2);
        List<Tour> toursToCancel = tourRepository.findToursToCancel(dateThreshold);
        for(Tour tour : toursToCancel) {
            System.out.println("we have tours to cancel");
            tour.setTourStatus("Rejected");
            tour.getTourApplication().setApplicationStatus("Rejected");
            tourApplicationRepos.save(tour.getTourApplication());
        }
        tourRepository.saveAll(toursToCancel);
    }

    /**
     * Periodically assigns advisors to tours that are within 3 days of their scheduled date
     * and do not have an assigned guide but are in the "Approved" state.
     *
     * Preconditions:
     * - Tours must be within 3 days of their chosen date.
     * - Advisors are selected based on availability and workload.
     *
     * Postconditions:
     * - Assigns the least-loaded available advisor to the tour.
     * - Updates the tour status to "AdvisorAssigned" and application status to "Approved".
     * - If no advisor is available, the tour remains unassigned.
     */
    @Scheduled(fixedRate = 10000) // 10 saniyelik rate ila çalışır
    public void assignAdvisorToUnenrolledTours() {
        LocalDate dateThreshold = LocalDate.now().plusDays(3);
        List<Tour> toursToBeAssignedToAdvisors = schoolTourRepos.findToursToBeAssignedToAdvisors(dateThreshold);// 3 günden az zaman kalan ve "Approved" state'inde olan turları getir
        // Sadece 3 günden az kalan turlar üzerinde işlem yapıyoruz
        for (Tour tour : toursToBeAssignedToAdvisors) {
            System.out.println("We have tours to assign to advisors");
            List<Advisor> availableAdvisors = new ArrayList<>();
            List<Advisor> advisorList = advisorRepos.findAllAdvisors();
            for(Advisor advisor: advisorList){
                if(advisor.getAssignedDay().equalsIgnoreCase(tour.getChosenDate().getDayOfWeek().toString())){
                    availableAdvisors.add(advisor);
                }
            }
            // Advisor'ları atanmış tur sayısına göre sıralayın
            availableAdvisors.sort(Comparator.comparingInt(advisor ->
                    advisorService.getAllAssignedUnfinishedTours(advisor.getEmail()).size()
            ));
            if (!availableAdvisors.isEmpty()) {
                // İlk advisor'a turu ata
                Advisor selectedAdvisor = availableAdvisors.get(0);
                tour.setAssignedGuide(selectedAdvisor);
                tour.setTourStatus("AdvisorAssigned");
                tour.getTourApplication().setApplicationStatus("Approved");
                schoolTourRepos.save(tour);
                tourApplicationRepos.save(tour.getTourApplication());
                System.out.println("Assigned tour to advisor: " + selectedAdvisor.getEmail());
            } else {
                System.out.println("No advisors available for this tour.");
            }
        }
        LocalDate dateThresholdForCancel = LocalDate.now().plusDays(2);
        if(tourRepository.isDatePassed(dateThreshold) != null){
            cancelUnenrolledTours();
        }
    }
}

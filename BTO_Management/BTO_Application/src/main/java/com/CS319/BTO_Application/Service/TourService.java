package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Entity.Tour;
import com.CS319.BTO_Application.Entity.TourGuide;
import com.CS319.BTO_Application.Repos.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TourService {
    private final SchoolTourRepos schoolTourRepos;
    private final SchoolTourApplicationRepos schoolTourApplicationRepos;
    private final TourGuideRepos tourGuideRepos;

    @Autowired
    public TourService(SchoolTourRepos schoolTourRepos, SchoolTourApplicationRepos schoolTourApplicationRepos, TourGuideRepos tourGuideRepos) {
        this.schoolTourRepos = schoolTourRepos;
        this.schoolTourApplicationRepos = schoolTourApplicationRepos;
        this.tourGuideRepos = tourGuideRepos;
    }

    /*
        this method changes the status of the schooltourapplication to enrolled
     */
    public Tour createSchoolTour(Tour tour, SchoolTourApplication schoolTourApplication) {
        schoolTourApplication.setApplicationStatus("Scheduled");
        schoolTourApplicationRepos.save(schoolTourApplication);
        return schoolTourRepos.save(tour);
    }

    public Tour changeTourStatus(Tour tour, String status) {
        tour.setTourStatus(status);
        return schoolTourRepos.save(tour);
    }

    public Tour getTourById(Long tourId) {
        return schoolTourRepos.findById(tourId)
                .orElseThrow(() -> new EntityNotFoundException("Tour not found with id: " + tourId));
    }

    public Tour assignTour(Tour tour, String tourGuideEmail) {
        TourGuide guide = tourGuideRepos.findByEmail(tourGuideEmail);
        if (guide == null) {
            throw new EntityNotFoundException("Tour guide not found with email: " + tourGuideEmail);
        }
        SchoolTourApplication schoolTourApplication = (SchoolTourApplication) tour.getTourApplication();
        schoolTourApplication.setApplicationStatus("Assigned");
        tour.setTourStatus("Assigned");
        tour.setAssignedGuide(guide);
        return schoolTourRepos.save(tour);
    }


}

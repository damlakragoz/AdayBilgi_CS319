package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.SchoolTourApplication;
import com.CS319.BTO_Application.Entity.Tour;
import com.CS319.BTO_Application.Entity.TourGuide;
import com.CS319.BTO_Application.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TourAssignmentService {
    private final SchoolTourRepos schoolTourRepos;
    private final SchoolTourApplicationRepos schoolTourApplicationRepos;
    private final TourGuideRepos tourGuideRepos;

    @Autowired
    public TourAssignmentService(SchoolTourRepos schoolTourRepos, SchoolTourApplicationRepos schoolTourApplicationRepos, TourGuideRepos tourGuideRepos) {
        this.schoolTourRepos = schoolTourRepos;
        this.schoolTourApplicationRepos = schoolTourApplicationRepos;
        this.tourGuideRepos = tourGuideRepos;
    }

    /*
        this method changes the status of the schooltourapplication to enrolled
     */
    public Tour addSchoolTour(Tour tour,String guideEmail, SchoolTourApplication schoolTourApplication) {
        TourGuide tourGuide = tourGuideRepos.findByEmail(guideEmail);
        tour.setAssignedGuide(tourGuide);
        schoolTourApplication.setStatus("Enrolled");
        schoolTourApplicationRepos.save(schoolTourApplication);
        return schoolTourRepos.save(tour);
    }

}

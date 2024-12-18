package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Repos.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/*
    The States are:
    +Pending
    +Approved *
    +Rejected
    +GuideAssigned -
    +WithdrawRequested *
    +AdvisorAssigned -
    +Withdrawn *

    note: After the tour is accepted by coordinator the "application_status"
     will be changed to "Approved" and will not change after that.
 */
@Service
public class TourService {
    private final SchoolTourRepos schoolTourRepos;
    private final TourGuideRepos tourGuideRepos;
    private final TourApplicationRepos tourApplicationRepos;
    private final AdvisorRepos advisorRepos;
    private final IndividualTourApplicationRepos individualTourApplicationRepos;

    @Autowired
    public TourService(SchoolTourRepos schoolTourRepos, TourGuideRepos tourGuideRepos, TourApplicationRepos tourApplicationRepos, AdvisorRepos advisorRepos, IndividualTourApplicationRepos individualTourApplicationRepos) {
        this.schoolTourRepos = schoolTourRepos;
        this.tourGuideRepos = tourGuideRepos;
        this.tourApplicationRepos = tourApplicationRepos;
        this.advisorRepos = advisorRepos;
        this.individualTourApplicationRepos = individualTourApplicationRepos;
    }

    /*
        this method changes the status of the schooltourapplication to enrolled
     */
    public Tour createSchoolTour(Tour tour, SchoolTourApplication schoolTourApplication) {
        return schoolTourRepos.save(tour);
    }
    public Tour createIndividualTour(Tour tour, IndividualTourApplication individualTourApplication) {
        return schoolTourRepos.save(tour);
    }

    public Tour setStatusApproved(Tour tour) {
        tour.setTourStatus("Approved");
        return schoolTourRepos.save(tour);
    }

    public Tour setStatusRejected(Tour tour) {
        tour.setTourStatus("Rejected");
        tour.getTourApplication().setApplicationStatus("Rejected");
        tourApplicationRepos.save(tour.getTourApplication());
        return schoolTourRepos.save(tour);
    }

    private void setStatusGuideAssigned(Tour tour) {
        tour.setTourStatus("GuideAssigned");
        schoolTourRepos.save(tour);
    }

    /*
        Guide requests withdraw and the corresponding advisor gets notified
        If advisor rejects the request the status will be changed to "Withdrawn"
        otherwise "AdvisorAssigned"
     */
    private void setStatusWithdrawRequested(Tour tour) {
        tour.setTourStatus("WithdrawRequested");
        schoolTourRepos.save(tour);
    }

    private void setStatusAdvisorAssigned(Tour tour) {
        tour.setTourStatus("AdvisorAssigned");
        schoolTourRepos.save(tour);
    }

    /*
        In this state the tour is open for other guides' application
        If no guide applies the previous guide will be assigned to the tour
        and the status will be changed to the "GuideAssigned"
     */
    private void setStatusWithdrawn(Tour tour) {
        tour.setTourStatus("Withdrawn");
        schoolTourRepos.save(tour);
    }

    private void setStatusFinished(Tour tour) {
        tour.setTourStatus("Finished");
        schoolTourRepos.save(tour);
    }

    public Tour getTourById(Long tourId) {
        System.out.println("in method");
        return schoolTourRepos.findById(tourId)
                .orElseThrow(() -> new EntityNotFoundException("Tour not found with id: " + tourId));
    }

    public Tour getTourByApplicationId(Long tourApplicationId) {
        System.out.println("in method");
        return schoolTourRepos.findByTourApplicationId(tourApplicationId);
    }

    public Tour assignTour(Tour tour, String tourGuideEmail) {
        TourGuide guide = tourGuideRepos.findByEmail(tourGuideEmail);
        if (guide == null) {
            throw new EntityNotFoundException("Tour guide not found with email: " + tourGuideEmail);
        }
        tour.getTourApplication().setApplicationStatus("Approved");
        setStatusGuideAssigned(tour);
        tour.setAssignedGuide(guide);
        return schoolTourRepos.save(tour);
    }

    public Tour requestWithdraw(Tour tour) {
        setStatusWithdrawRequested(tour);
        return schoolTourRepos.save(tour);
    }

    public Tour acceptWithdrawRequest(Tour tour, String advisorEmail) {
        Advisor advisor = advisorRepos.findByEmail(advisorEmail);
        if (advisor == null) {
            throw new EntityNotFoundException("Advisor not found with email: " + advisorEmail);
        }
        setStatusAdvisorAssigned(tour);
        tour.setAssignedGuide(advisor);
        return schoolTourRepos.save(tour);
    }

    public Tour rejectWithdrawRequest(Tour tour, String advisorEmail) {
        Advisor advisor = advisorRepos.findByEmail(advisorEmail);
        if (advisor == null) {
            throw new EntityNotFoundException("Advisor not found with email: " + advisorEmail);
        }
        setStatusWithdrawn(tour);
        return schoolTourRepos.save(tour);
    }

    public List<Tour> getAllTours() {
        System.out.println("GETALLTOURS IS CALLED");
        return schoolTourRepos.findAll();
    }

    public void cancelTourByCounselor(Long tourApplicationId) {
        Tour tour = schoolTourRepos.findByTourApplicationId(tourApplicationId);
        setStatusRejected(tour);
        schoolTourRepos.save(tour);
    }

    public Tour submitTourActivity(Tour tour, double durationTime) {
        tour.setDuration(durationTime);
        setStatusFinished(tour);
        tour.getTourApplication().setApplicationStatus("Finished");
        return tour;
    }

    public List<Tour> getToursByMonthAndYear(int month, int year) {
        return schoolTourRepos.findToursByMonthAndYear(month, year);
    }

    public List<Tour> getFinishedToursByMonthAndYear(int month, int year) {
        return schoolTourRepos.findFinishedToursByMonthAndYear(month, year);
    }
}
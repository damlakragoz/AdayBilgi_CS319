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
    /**
     * Creates a new school tour and saves it to the repository.
     *
     * Preconditions:
     * - The `tour` and `schoolTourApplication` must not be null.
     *
     * Postconditions:
     * - The `tour` is saved to the database with its details.
     *
     * @param tour The tour to be created.
     * @param schoolTourApplication The application associated with the tour.
     * @return The saved `Tour` entity.
     */
    public Tour createSchoolTour(Tour tour, SchoolTourApplication schoolTourApplication) {
        return schoolTourRepos.save(tour);
    }

    /**
     * Creates a new individual tour and saves it to the repository.
     *
     * Preconditions:
     * - The `tour` and `individualTourApplication` must not be null.
     *
     * Postconditions:
     * - The `tour` is saved to the database with its details.
     *
     * @param tour The tour to be created.
     * @param individualTourApplication The application associated with the tour.
     * @return The saved `Tour` entity.
     */
    public Tour createIndividualTour(Tour tour, IndividualTourApplication individualTourApplication) {
        return schoolTourRepos.save(tour);
    }

    /**
     * Updates the status of a tour to "Approved".
     *
     * Preconditions:
     * - The `tour` must not be null.
     *
     * Postconditions:
     * - The tour's status is updated to "Approved" and saved to the database.
     *
     * @param tour The tour to be updated.
     * @return The updated `Tour` entity.
     */
    public Tour setStatusApproved(Tour tour) {
        tour.setTourStatus("Approved");
        return schoolTourRepos.save(tour);
    }

    /**
     * Updates the status of a tour to "Rejected" and marks the associated application as "Rejected".
     *
     * Preconditions:
     * - The `tour` must not be null.
     *
     * Postconditions:
     * - The tour's status is updated to "Rejected".
     * - The application status is also updated to "Rejected".
     *
     * @param tour The tour to be rejected.
     * @return The updated `Tour` entity.
     */
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

    /**
     * Assigns a tour guide to a tour and updates the tour's status.
     *
     * Preconditions:
     * - The `tour` and `tourGuideEmail` must not be null.
     * - The `tourGuideEmail` must correspond to an existing tour guide.
     *
     * Postconditions:
     * - The tour guide is assigned to the tour.
     * - The tour's status is updated to "GuideAssigned".
     * - The application status is updated to "Approved".
     *
     * @param tour The tour to be updated.
     * @param tourGuideEmail The email of the tour guide to assign.
     * @return The updated `Tour` entity.
     */
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

    /**
     * Marks a tour as having a withdraw request.
     *
     * Preconditions:
     * - The `tour` must not be null.
     *
     * Postconditions:
     * - The tour's status is updated to "WithdrawRequested".
     *
     * @param tour The tour to update.
     * @return The updated `Tour` entity.
     */
    public Tour requestWithdraw(Tour tour) {
        setStatusWithdrawRequested(tour);
        return schoolTourRepos.save(tour);
    }

    /**
     * Accepts a withdraw request for a tour and assigns an advisor to handle it.
     *
     * Preconditions:
     * - The `tour` and `advisorEmail` must not be null.
     * - The `advisorEmail` must correspond to an existing advisor.
     *
     * Postconditions:
     * - The tour's status is updated to "AdvisorAssigned".
     * - The advisor is assigned to the tour.
     *
     * @param tour The tour to update.
     * @param advisorEmail The email of the advisor.
     * @return The updated `Tour` entity.
     */
    public Tour acceptWithdrawRequest(Tour tour, String advisorEmail) {
        Advisor advisor = advisorRepos.findByEmail(advisorEmail);
        if (advisor == null) {
            throw new EntityNotFoundException("Advisor not found with email: " + advisorEmail);
        }
        setStatusAdvisorAssigned(tour);
        tour.setAssignedGuide(advisor);
        return schoolTourRepos.save(tour);
    }

    /**
     * Rejects a withdraw request for a tour and updates the status.
     *
     * Preconditions:
     * - The `tour` and `advisorEmail` must not be null.
     * - The `advisorEmail` must correspond to an existing advisor.
     *
     * Postconditions:
     * - The tour's status is updated to "Withdrawn".
     *
     * @param tour The tour to update.
     * @param advisorEmail The email of the advisor.
     * @return The updated `Tour` entity.
     */
    public Tour rejectWithdrawRequest(Tour tour, String advisorEmail) {
        Advisor advisor = advisorRepos.findByEmail(advisorEmail);
        if (advisor == null) {
            throw new EntityNotFoundException("Advisor not found with email: " + advisorEmail);
        }
        setStatusWithdrawn(tour);
        return schoolTourRepos.save(tour);
    }

    public List<Tour> getAllIndividualTours() {
        System.out.println("GETAll Individual tours IS CALLED");
        return schoolTourRepos.findAllByType("individual");
    }

    public List<Tour> getAllSchoolTours() {
        System.out.println("GETAll School tours IS CALLED");
        return schoolTourRepos.findAllByType("school");
    }

    /**
     * Cancels a tour based on the counselor's request and updates its status.
     *
     * Preconditions:
     * - The `tourApplicationId` must correspond to an existing tour application.
     *
     * Postconditions:
     * - The tour's status is updated to "Rejected".
     * - The application status is also updated to "Rejected".
     *
     * @param tourApplicationId The ID of the tour application to cancel.
     */
    public void cancelTourByCounselor(Long tourApplicationId) {
        Tour tour = schoolTourRepos.findByTourApplicationId(tourApplicationId);
        setStatusRejected(tour);
        schoolTourRepos.save(tour);
    }

    /**
     * Submits the activity for a completed tour and updates the guide's work hours.
     *
     * Preconditions:
     * - The `tour` and `durationTime` must not be null.
     * - The `durationTime` must be greater than 0.
     *
     * Postconditions:
     * - The tour's duration is updated.
     * - The guide's work hours are incremented by `durationTime`.
     * - The tour's status is updated to "Finished".
     * - The application status is updated to "Finished".
     *
     * @param tour The tour to update.
     * @param durationTime The duration of the activity.
     * @return The updated `Tour` entity.
     */
    public Tour submitTourActivity(Tour tour, double durationTime) {
        if(tour.getAssignedGuide() != null){
            TourGuide guide = tour.getAssignedGuide();
            guide.setWorkHours(guide.getWorkHours() + durationTime);
        }

        tour.setDuration(durationTime);
        setStatusFinished(tour);
        tour.getTourApplication().setApplicationStatus("Finished");
        return tour;
    }

    /**
     * Edits the activity for a tour and adjusts the guide's work hours accordingly.
     *
     * Preconditions:
     * - The `tour` and `durationTime` must not be null.
     * - The `durationTime` must be greater than 0.
     *
     * Postconditions:
     * - The tour's duration is updated.
     * - The guide's work hours are adjusted based on the new `durationTime`.
     * - The tour's status is updated to "Finished".
     * - The application status is updated to "Finished".
     *
     * @param tour The tour to update.
     * @param durationTime The new duration of the activity.
     * @return The updated `Tour` entity.
     */
    public Tour editTourActivity(Tour tour, double durationTime) {
        if(tour.getAssignedGuide() != null){
            TourGuide guide = tour.getAssignedGuide();
            if(tour.getTourStatus().equals("Finished")){
                Double prevWorkhours = tour.getDuration();
                guide.setWorkHours(guide.getWorkHours() - prevWorkhours);
                guide.setWorkHours(guide.getWorkHours() + durationTime);
            }
        }
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

    public List<Tour> getAllTours() {
        return schoolTourRepos.findAll(); // SchoolTourRepos stands for tour repo but don't rename it!
    }

}
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
    +GuideAssigned
    +ExecutiveAssigned
    +Finished

    note: After the fair is accepted by coordinator the "application_status"
     will be changed to "Pending" and will not change after that.
 */

@Service
public class FairService {
    private final FairRepos fairRepos;
    private final FairInvitationRepos fairInvitationRepos;
    private final TourGuideRepos tourGuideRepos;
    private final CoordinatorRepos coordinatorRepos;
    private final ExecutiveRepos executiveRepos;

    @Autowired
    public FairService(FairRepos fairRepos, FairInvitationRepos fairInvitationRepos, TourGuideRepos tourGuideRepos, CoordinatorRepos coordinatorRepos, ExecutiveRepos executiveRepos) {
        this.fairRepos = fairRepos;
        this.fairInvitationRepos = fairInvitationRepos;
        this.tourGuideRepos = tourGuideRepos;
        this.coordinatorRepos = coordinatorRepos;
        this.executiveRepos = executiveRepos;
    }

    public void saveFair(Fair fair, FairInvitation fairInvitation) {
        fairRepos.save(fair);
    }


    public Fair setStatusGuideAssigned(Fair fair) {
        fair.setFairStatus("GuideAssigned");
        return fairRepos.save(fair);
    }

    public Fair setStatusExecutiveAssigned(Fair fair) {
        fair.setFairStatus("ExecutiveAssigned");
        return fairRepos.save(fair);
    }
    /*
    public Fair setStatusExecutiveAndGuideAssigned(Fair fair) {
        fair.setFairStatus("ExecutiveAndGuideAssigned");
        return fairRepos.save(fair);
    }
     */

    public Fair setStatusFinished(Fair fair) {
        fair.setFairStatus("Finished");
        return fairRepos.save(fair);
    }

    public Fair setStatusCancelled(Fair fair) {
        fair.setFairStatus("Cancelled");
        return fairRepos.save(fair);
    }

    /**
     * Assigns a tour guide and/or executive to a fair.
     *
     * Preconditions:
     * - `fair` must not be null.
     * - `tourGuideEmail` and `executiveEmail` must be valid emails.
     *
     * Postconditions:
     * - The fair is assigned to the specified tour guide and/or executive.
     * - The fair is saved in the repository.
     *
     * @param fair The fair to assign.
     * @param tourGuideEmail The email of the tour guide to assign.
     * @param executiveEmail The email of the executive to assign.
     * @return The assigned fair.
     */
    public Fair assignFair(Fair fair, String tourGuideEmail, String executiveEmail) {
        TourGuide guide = null;
        Executive executive = null;

        if (tourGuideEmail!=null) {
            guide = tourGuideRepos.findByEmail(tourGuideEmail);
        }
        if (executiveEmail != null) {
            executive = executiveRepos.findByEmail(executiveEmail);
        }

        if (guide != null) {
            //setStatusGuideAssigned(fair);
            fair.setAssignedGuideToFair(guide);
        } else if (executive != null) {
            //setStatusExecutiveAssigned(fair);
            fair.setAssignedExecutive(executive);
        } else {
            throw new EntityNotFoundException("BTO Member not found with emails: " + executiveEmail + " or " + tourGuideEmail);

        }
        fair.getFairInvitation().setFairInvitationStatus("Approved");
        return fairRepos.save(fair);
    }

    public Fair getFairById(Long fairId) {
        return fairRepos.findById(fairId)
                .orElseThrow(() -> new EntityNotFoundException("Fair not found with id: " + fairId));
    }

    public List<Fair> getAllFairs() {
        return fairRepos.findAll();
    }

    /**
     * Submits a fair activity as a guide.
     *
     * Preconditions:
     * - `fair` must not be null.
     * - `durationTime` must be a positive number.
     *
     * Postconditions:
     * - The fair activity is submitted.
     * - The fair status is updated to "Finished".
     * - The fair is saved in the repository.
     *
     * @param fair The fair to submit.
     * @param durationTime The duration of the fair activity.
     * @return The submitted fair.
     */
    public Fair submitFairActivityAsGuide(Fair fair, double durationTime) {
        if(fair.getAssignedGuideToFair() != null){
            TourGuide guide = fair.getAssignedGuideToFair();
            guide.setWorkHours(guide.getWorkHours() + durationTime);
        }
        fair.setDuration(durationTime);
        setStatusFinished(fair);
        fair.getFairInvitation().setFairInvitationStatus("Finished");
        return fair;
    }

    /**
     * Edits a fair activity as a guide.
     *
     * Preconditions:
     * - `fair` must not be null.
     * - `durationTime` must be a positive number.
     *
     * Postconditions:
     * - The fair activity is edited.
     * - The fair status is updated to "Finished".
     * - The fair is saved in the repository.
     *
     * @param fair The fair to edit.
     * @param durationTime The new duration of the fair activity.
     * @return The edited fair.
     */
    public Fair editFairActivityAsGuide(Fair fair, double durationTime) {
        if(fair.getAssignedGuideToFair() != null){
            TourGuide guide = fair.getAssignedGuideToFair();
            if(fair.getFairStatus().equals("Finished")){
                Double prevWorkhours = fair.getDuration();
                guide.setWorkHours(guide.getWorkHours() - prevWorkhours);
                guide.setWorkHours(guide.getWorkHours() + durationTime);
            }
        }
        fair.setDuration(durationTime);
        setStatusFinished(fair);
        fair.getFairInvitation().setFairInvitationStatus("Finished");
        return fair;
    }

    /**
     * Submits a fair activity as an executive.
     *
     * Preconditions:
     * - `fair` must not be null.
     * - `durationTime` must be a positive number.
     *
     * Postconditions:
     * - The fair activity is submitted.
     * - The fair status is updated to "Finished".
     * - The fair is saved in the repository.
     *
     * @param fair The fair to submit.
     * @param durationTime The duration of the fair activity.
     * @return The submitted fair.
     */
    public Fair submitFairActivityAsExecutive(Fair fair, double durationTime) {
        fair.setDuration(durationTime);
        setStatusFinished(fair);
        fair.getFairInvitation().setFairInvitationStatus("Finished");
        return fair;
    }

    /**
     * Edits a fair activity as an executive.
     *
     * Preconditions:
     * - `fair` must not be null.
     * - `durationTime` must be a positive number.
     *
     * Postconditions:
     * - The fair activity is edited.
     * - The fair status is updated to "Finished".
     * - The fair is saved in the repository.
     *
     * @param fair The fair to edit.
     * @param durationTime The new duration of the fair activity.
     * @return The edited fair.
     */
    public Fair editFairActivityAsExecutive(Fair fair, double durationTime) {
        fair.setDuration(durationTime);
        setStatusFinished(fair);
        fair.getFairInvitation().setFairInvitationStatus("Finished");
        return fair;
    }

    public List<Fair> getFairsByMonthAndYear(int month, int year) {
        return fairRepos.findFairsByMonthAndYear(month, year);
    }

    public List<Fair> getFinishedFairsByMonthAndYear(int month, int year) {
        return fairRepos.findFinishedFairsByMonthAndYear(month, year);
    }

    public Fair getFairByInvitationId(Long fairInvitationId) {
        return fairRepos.findByFairInvitationId(fairInvitationId);
    }

//    public void cancelFairByCounselor(Long fairInvitationId) {
//        Fair fair = fairRepos.findByFairInvitationId(fairInvitationId);
//        if (fair != null){
//            setStatusCancelled(fair);
//            fairRepos.save(fair);
//        }
//    }

}
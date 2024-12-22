package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.Feedback;
import com.CS319.BTO_Application.Entity.Tour;
import com.CS319.BTO_Application.Repos.CounselorRepos;
import com.CS319.BTO_Application.Repos.FeedbackRepos;
import com.CS319.BTO_Application.Repos.SchoolTourRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepos feedbackRepository;
    private final SchoolTourRepos schoolTourRepository;
    private final CounselorRepos counselorRepos;

    @Autowired
    public FeedbackService(FeedbackRepos feedbackRepository, SchoolTourRepos schoolTourRepository, CounselorRepos counselorRepos) {
        this.feedbackRepository = feedbackRepository;
        this.schoolTourRepository = schoolTourRepository;
        this.counselorRepos = counselorRepos;
    }

    /**
     * Submits feedback for a finished tour.
     *
     * Preconditions:
     * - The tour must exist in the database.
     * - The tour status must be "Finished".
     * - No feedback should already exist for the tour.
     *
     * Postconditions:
     * - A new feedback entry is created and associated with the specified tour.
     *
     * @param tourId         The ID of the tour for which feedback is being submitted.
     * @param rating         The rating provided for the tour (e.g., 1-5).
     * @param comment        The feedback comment.
     * @param counselorEmail The email of the counselor providing the feedback.
     * @return The saved feedback entity.
     * @throws IllegalArgumentException If the tour does not exist, the status is not "Finished",
     *                                   or feedback already exists for the tour.
     */
    public Feedback submitFeedback(Long tourId, int rating, String comment, String counselorEmail) {
        Tour tour = schoolTourRepository.findById(tourId)
                .orElseThrow(() -> new IllegalArgumentException("Tour not found with ID: " + tourId));

        if (!"Finished".equals(tour.getTourStatus())) {
            throw new IllegalArgumentException("Feedback can only be submitted for tours with status 'Finished'.");
        }

        if (feedbackRepository.existsByTour(tour)) {
            throw new IllegalArgumentException("Feedback already exists for this Tour.");
        }
        Counselor counselor = counselorRepos.findByEmail(counselorEmail);
        Feedback feedback = new Feedback(tour, rating, comment, counselor); // Set counselor if needed
        return feedbackRepository.save(feedback);
    }

    /**
     * Retrieves all feedback entries from the database.
     *
     * @return A list of all feedback entries.
     */
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    /**
     * Retrieves feedback for a specific tour by its ID.
     *
     * Preconditions:
     * - A feedback entry must exist for the specified tour ID.
     *
     * @param tourId The ID of the tour for which feedback is being retrieved.
     * @return The feedback associated with the tour.
     * @throws IllegalArgumentException If no feedback is found for the specified tour ID.
     */
    public Feedback getFeedbackByTourId(Long tourId) {
        return feedbackRepository.findByTourId(tourId)
                .orElseThrow(() -> new IllegalArgumentException("No feedback found for Tour ID: " + tourId));
    }

    /**
     * Deletes a feedback entry by its ID.
     *
     * Preconditions:
     * - The feedback entry must exist in the database.
     *
     * Postconditions:
     * - The feedback entry is removed from the database.
     *
     * @param feedbackId The ID of the feedback to delete.
     * @throws IllegalArgumentException If no feedback is found with the specified ID.
     */
    public void deleteFeedback(Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found with ID: " + feedbackId));
        feedbackRepository.delete(feedback);
    }
}

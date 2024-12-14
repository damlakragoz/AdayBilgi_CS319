package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.Feedback;
import com.CS319.BTO_Application.Repos.FeedbackRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepos feedbackRepository;
    private final CounselorService counselorService;

    @Autowired
    public FeedbackService(FeedbackRepos feedbackRepository, CounselorService counselorService) {
        this.feedbackRepository = feedbackRepository;
        this.counselorService = counselorService;
    }

    /**
     * Adds feedback for a counselor.
     *
     * @param counselorId the ID of the counselor
     * @param feedback    the feedback entity to save
     */
    public void addFeedback(Long counselorId, Feedback feedback) {
        // Validate counselor existence
        Counselor counselor = counselorService.getCounselorById(counselorId);
        if (feedback.getTour() == null) {
            throw new IllegalArgumentException("Tour is required for feedback.");
        }
        if (feedback.getRating() < 1 || feedback.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        // Associate feedback with counselor and save
        feedback.setCounselor(counselor);
        feedbackRepository.save(feedback);
    }

    /**
     * Retrieves all feedback.
     *
     * @return a list of all feedback
     */
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    /**
     * Retrieves feedback by its ID.
     *
     * @param id the feedback ID
     * @return the Feedback entity
     */
    public Feedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Feedback with ID " + id + " does not exist."));
    }

    /**
     * Deletes feedback by its ID.
     *
     * @param id the feedback ID
     */
    public void deleteFeedback(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new IllegalArgumentException("Feedback with ID " + id + " does not exist.");
        }
        feedbackRepository.deleteById(id);
    }
}

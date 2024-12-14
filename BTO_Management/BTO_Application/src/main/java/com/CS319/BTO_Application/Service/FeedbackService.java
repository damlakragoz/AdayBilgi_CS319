/*
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

    @Autowired
    private FeedbackRepos feedbackRepository;

    @Autowired
    private CounselorService counselorService;

    public void addFeedback(Long counselorId, Feedback feedback) {
        Counselor counselor = counselorService.getCounselorById(counselorId);
        feedback.setCounselor(counselor);

        if (feedback.getTour() == null) {
            throw new IllegalArgumentException("Tour is required for feedback.");
        }
        if (feedback.getRating() < 1 || feedback.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }
        feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public Feedback getFeedbackById(Long id) {
        Optional<Feedback> feedbackOptional = feedbackRepository.findById(id);
        if (feedbackOptional.isEmpty()) {
            throw new IllegalArgumentException("Feedback with ID " + id + " does not exist.");
        }
        return feedbackOptional.get();
    }

    public void deleteFeedback(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new IllegalArgumentException("Feedback with ID " + id + " does not exist.");
        }
        feedbackRepository.deleteById(id);
    }
}

 */

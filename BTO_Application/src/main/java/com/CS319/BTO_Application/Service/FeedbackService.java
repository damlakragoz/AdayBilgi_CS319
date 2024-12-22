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

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public Feedback getFeedbackByTourId(Long tourId) {
        return feedbackRepository.findByTourId(tourId)
                .orElseThrow(() -> new IllegalArgumentException("No feedback found for Tour ID: " + tourId));
    }

    public void deleteFeedback(Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found with ID: " + feedbackId));
        feedbackRepository.delete(feedback);
    }
}

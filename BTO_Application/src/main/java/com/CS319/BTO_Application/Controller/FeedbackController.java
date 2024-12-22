package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Entity.Feedback;
import com.CS319.BTO_Application.Service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @Autowired
    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // Submit Feedback
    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestParam Long tourId,
                                            @RequestParam int rating,
                                            @RequestParam String comment,
                                            @RequestParam(required = false) String counselorEmail) {
        try {
            Feedback feedback = feedbackService.submitFeedback(tourId, rating, comment, counselorEmail);
            return ResponseEntity.ok(feedback);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Get All Feedbacks
    @GetMapping("/getAll")
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }

    // Get Feedback by Tour ID
    @GetMapping("/getByTour")
    public ResponseEntity<?> getFeedbackByTourId(@RequestParam Long tourId) {
        try {
            Feedback feedback = feedbackService.getFeedbackByTourId(tourId);
            return ResponseEntity.ok(feedback);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Delete Feedback by ID
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFeedback(@RequestParam Long feedbackId) {
        try {
            feedbackService.deleteFeedback(feedbackId);
            return ResponseEntity.ok("Feedback successfully deleted.");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}

/*
package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.FeedbackRequest;
import com.CS319.BTO_Application.Entity.Feedback;
import com.CS319.BTO_Application.Service.FeedbackService;
import com.CS319.BTO_Application.Service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    private static final Logger log = LoggerFactory.getLogger(FeedbackController.class);

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private TourService tourService;

    @PostMapping
    public ResponseEntity<?> createFeedback(@RequestParam Long counselorId, @RequestBody FeedbackRequest feedbackRequest) {
        try {
            Feedback feedback = new Feedback();
            feedback.setTour(tourService.getTourById(feedbackRequest.getTourId()));
            feedback.setRating(feedbackRequest.getRating());
            feedback.setComment(feedbackRequest.getComment());

            feedbackService.addFeedback(counselorId, feedback);

            log.info("Feedback created successfully for counselorId: {}", counselorId);
            return ResponseEntity.status(HttpStatus.CREATED).body("Feedback created successfully.");
        } catch (IllegalArgumentException ex) {
            log.warn("Validation failed while creating feedback: {}", ex.getMessage());
            return ResponseEntity.badRequest().body("Invalid data: " + ex.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error occurred while creating feedback", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating feedback.");
        }
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        List<Feedback> feedbackList = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(feedbackList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFeedbackById(@PathVariable Long id) {
        try {
            Feedback feedback = feedbackService.getFeedbackById(id);
            log.info("Feedback retrieved with id: {}", id);
            return ResponseEntity.ok(feedback);
        } catch (IllegalArgumentException e) {
            log.warn("Feedback with id {} not found: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        try {
            feedbackService.deleteFeedback(id);
            return ResponseEntity.ok("Feedback deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

 */

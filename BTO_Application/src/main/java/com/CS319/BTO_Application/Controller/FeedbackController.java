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

    /**
     * Submits feedback for a tour.
     *
     * Preconditions:
     * - `tourId` must not be null and must correspond to an existing tour.
     * - `rating` must be a valid integer.
     * - `comment` must not be null.
     * - `counselorEmail` is optional.
     *
     * Postconditions:
     * - The feedback is saved in the repository.
     * - Returns the submitted feedback.
     *
     * @param tourId The ID of the tour.
     * @param rating The rating of the tour.
     * @param comment The comment for the tour.
     * @param counselorEmail The email of the counselor (optional).
     * @return ResponseEntity containing the submitted feedback or error status.
     */
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

    /**
     * Retrieves feedback by tour ID.
     *
     * Preconditions:
     * - `tourId` must not be null and must correspond to an existing tour.
     *
     * Postconditions:
     * - Returns the feedback for the specified tour.
     * - If the feedback does not exist, returns status 400 (BAD_REQUEST).
     *
     * @param tourId The ID of the tour.
     * @return ResponseEntity containing the feedback or error status.
     */
    @GetMapping("/getByTour")
    public ResponseEntity<?> getFeedbackByTourId(@RequestParam Long tourId) {
        try {
            Feedback feedback = feedbackService.getFeedbackByTourId(tourId);
            return ResponseEntity.ok(feedback);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /**
     * Deletes feedback by ID.
     *
     * Preconditions:
     * - `feedbackId` must not be null and must correspond to an existing feedback.
     *
     * Postconditions:
     * - The specified feedback is deleted.
     * - Returns a success message.
     * - If the feedback does not exist, returns status 400 (BAD_REQUEST).
     *
     * @param feedbackId The ID of the feedback to delete.
     * @return ResponseEntity containing the success message or error status.
     */
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

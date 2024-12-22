package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Entity.Fair;
import com.CS319.BTO_Application.Entity.Tour;
import com.CS319.BTO_Application.Repos.TourGuideRepos;
import com.CS319.BTO_Application.Service.TourGuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/tourguide")
public class TourGuideController {

    private final TourGuideService tourGuideService;

    @Autowired
    public TourGuideController(TourGuideService tourGuideService) {
        this.tourGuideService = tourGuideService;
    }

    /**
     * Retrieves the tours assigned to a tour guide.
     *
     * Preconditions:
     * - `guideEmail` must not be null and must correspond to an existing tour guide.
     *
     * Postconditions:
     * - Returns a list of tours assigned to the specified tour guide.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param guideEmail The email of the tour guide.
     * @return ResponseEntity containing the list of assigned tours or error status.
     */
    @GetMapping("/get/enrolledTours")
    public ResponseEntity<?> getAssignedTours(@RequestParam String guideEmail) {

        System.out.println("guide controller is entered");
        System.out.println("In controller");
        try {
            // Fetch all tour guides from the service
            List<Tour> tours = tourGuideService.getAssignedTours(guideEmail);
            return ResponseEntity.ok(tours); // Return the list of tours with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving the assigned guide.");
        }
    }

    /**
     * Retrieves the fairs assigned to a tour guide.
     *
     * Preconditions:
     * - `guideEmail` must not be null and must correspond to an existing tour guide.
     *
     * Postconditions:
     * - Returns a list of fairs assigned to the specified tour guide.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param guideEmail The email of the tour guide.
     * @return ResponseEntity containing the list of assigned fairs or error status.
     */
    @GetMapping("/get/enrolledFairs")
    public ResponseEntity<?> getEnrolledFairs(@RequestParam String guideEmail) {
        try {
            List<Fair> fairs = tourGuideService.getAssignedFairs(guideEmail);
            return ResponseEntity.ok(fairs); // Return the list of fairs with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving the assigned guides.");
        }
    }
}
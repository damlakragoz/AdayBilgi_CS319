package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Entity.Tour;
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
}
package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.UpdateWorkHoursRequest;
import com.CS319.BTO_Application.Entity.TourGuide;
import com.CS319.BTO_Application.Service.TourGuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tourguide")
@CrossOrigin(origins = "http://localhost:3000")
public class TourGuideController {

    private final TourGuideService tourGuideService;

    @Autowired
    public TourGuideController(TourGuideService tourGuideService) {
        this.tourGuideService = tourGuideService;
    }

    // Endpoint to update work hours
    @PutMapping("/updateWorkHours")
    public ResponseEntity<?> updateWorkHours(@RequestBody UpdateWorkHoursRequest request) {
        try {
            // Log incoming request data
            System.out.println("Request to update work hours: " + request.getUserName() + ", Hours: " + request.getHoursWorked());

            // Fetch the tour guide by their username (email)
            TourGuide tourGuide = tourGuideService.getTourGuideByEmail(request.getUserName());
            if (tourGuide == null) {
                return ResponseEntity.status(404).body("Tour guide not found");
            }

            // Log existing work hours before updating
            System.out.println("Existing work hours for " + tourGuide.getEmail() + ": " + tourGuide.getWorkHours());

            // Update the work hours
            tourGuide.setWorkHours(tourGuide.getWorkHours() + request.getHoursWorked());
            tourGuideService.saveTourGuide(tourGuide); // Save the updated tour guide

            // Log updated work hours
            System.out.println("Updated work hours for " + tourGuide.getEmail() + ": " + tourGuide.getWorkHours());

            return ResponseEntity.ok("Work hours updated successfully!");
        } catch (Exception e) {
            // Log the exception
            System.err.println("Error updating work hours: " + e.getMessage());
            return ResponseEntity.status(500).body("Error updating work hours: " + e.getMessage());
        }
    }
}

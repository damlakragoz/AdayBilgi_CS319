package com.CS319.BTO_Application.controller;

import com.CS319.BTO_Application.service.TourApplicationService;
import com.CS319.BTO_Application.entity.TourApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Controller
public class TourApplicationController{

    private final TourApplicationService tourApplicationService;

    @Autowired
    public TourApplicationController(TourApplicationService tourApplicationService) {
        this.tourApplicationService = tourApplicationService;
    }
    @GetMapping("/tour-applications")
    public List<TourApplication> getAllTourApplications() {
        return tourApplicationService.getAllTourApplications();
    }

    @PostMapping
    public ResponseEntity<String> addApplication(@RequestBody TourApplication tourApplication) {
        // Logic to save the application to the database
        System.out.println("Application saved: " + tourApplication);
        return ResponseEntity.ok("Application submitted successfully!");
    }
}
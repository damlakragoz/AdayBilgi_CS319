package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Entity.Advisor;
import com.CS319.BTO_Application.Entity.Tour;
import com.CS319.BTO_Application.Service.AdvisorService;
import com.CS319.BTO_Application.Service.TourGuideService;
import com.CS319.BTO_Application.Service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/api/advisor")
public class AdvisorController {

    private final AdvisorService advisorService;
    private final TourService tourService;

    @Autowired
    public AdvisorController(AdvisorService advisorService, TourService tourService) {
        this.advisorService = advisorService;
        this.tourService = tourService;
    }

    @GetMapping("/get/all-assigned-day-tours")
    public ResponseEntity<?> getAllAssignedDayTours(@RequestParam String advisorEmail) {
        List<Tour> tours = tourService.getAllSchoolTours();
        List<Tour> tours_withdraw_requested = new ArrayList<>();
        if(advisorService.getAdvisorByEmail(advisorEmail) == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Advisor advisor = advisorService.getAdvisorByEmail(advisorEmail);
        for(Tour tour: tours){
            if(tour.getChosenDate().getDayOfWeek().toString().equalsIgnoreCase(advisor.getAssignedDay())){
                tours_withdraw_requested.add(tour);
            }
        }
        for(Tour tour: tours_withdraw_requested){
            System.out.println("TOURRRR");
        }
        return ResponseEntity.ok(tours_withdraw_requested); // Return the list of tours with a 200 OK status
    }
}

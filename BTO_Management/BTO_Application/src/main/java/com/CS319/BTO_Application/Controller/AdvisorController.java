package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Service.AdvisorService;
import com.CS319.BTO_Application.Service.TourGuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/advisor")
public class AdvisorController {

    private final AdvisorService advisorService;

    @Autowired
    public AdvisorController(AdvisorService advisorService) {
        this.advisorService = advisorService;
    }
}

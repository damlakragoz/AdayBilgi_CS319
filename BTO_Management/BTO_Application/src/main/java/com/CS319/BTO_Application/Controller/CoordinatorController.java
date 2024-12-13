package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Service.CoordinatorService;
import com.CS319.BTO_Application.Service.CounselorService;
import com.CS319.BTO_Application.Service.HighSchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coordinator")
public class CoordinatorController {

    private final CoordinatorService coordinatorService;
    private final HighSchoolService highschoolService;

    @Autowired
    public CoordinatorController(CoordinatorService coordinatorService, HighSchoolService highschoolService) {
        this.coordinatorService = coordinatorService;
        this.highschoolService = highschoolService;
    }
}
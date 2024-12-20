package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @Autowired
    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/userCounts")
    public ResponseEntity<?> getUserCounts() {

        System.out.println("User Counts:");
        statisticsService.getUserCountByRole().forEach((key, value) -> System.out.println(key + ": " + value)); // Print all key-value pairs

        return new ResponseEntity<>(statisticsService.getUserCountByRole(), HttpStatus.OK);
    }

    @GetMapping("/tourGuideCountByDepartment")
    public ResponseEntity<?> getTourGuideCountByDepartment() {
        return new ResponseEntity<>(statisticsService.getTourGuideCountByDepartment(), HttpStatus.OK);
    }

    @GetMapping("/tourGuideCountByGrade")
    public ResponseEntity<?> getTourGuideCountByGrade() {
        return new ResponseEntity<>(statisticsService.getTourGuideCountByGrade(), HttpStatus.OK);
    }

    @GetMapping("/tourApplicationCountByStatus")
    public ResponseEntity<?> getTourApplicationCountByStatus() {
        return new ResponseEntity<>(statisticsService.getTourApplicationCountByStatus(), HttpStatus.OK);
    }

    @GetMapping("/tourApplicationCountByType")
    public ResponseEntity<?> getTourApplicationCountByType() {
        return new ResponseEntity<>(statisticsService.getTourApplicationCountByType(), HttpStatus.OK);
    }

    @GetMapping("/tourCountByHighSchool")
    public ResponseEntity<?> getTourCountByHighSchool() {
        return new ResponseEntity<>(statisticsService.getTourCountByHighSchool(), HttpStatus.OK);
    }

    @GetMapping("/highSchoolCountByCity")
    public ResponseEntity<?> getHighSchoolCountByCity() {
        return new ResponseEntity<>(statisticsService.getHighSchoolCountByCity(), HttpStatus.OK);
    }

    @GetMapping("/feedbackCountByRating")
    public ResponseEntity<?> getFeedbackCountByRating() {
        return new ResponseEntity<>(statisticsService.getFeedbackCountByRating(), HttpStatus.OK);
    }

    @GetMapping("/fairInvitationCountByStatus")
    public ResponseEntity<?> getFairInvitationCountByStatus() {
        return new ResponseEntity<>(statisticsService.getFairInvitationCountByStatus(), HttpStatus.OK);
    }
}

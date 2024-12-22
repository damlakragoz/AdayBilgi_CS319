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

    /**
     * Retrieves the count of users by their roles.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a map of user roles and their respective counts.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the user counts by role or error status.
     */
    @GetMapping("/userCounts")
    public ResponseEntity<?> getUserCounts() {

        System.out.println("User Counts:");
        statisticsService.getUserCountByRole().forEach((key, value) -> System.out.println(key + ": " + value)); // Print all key-value pairs

        return new ResponseEntity<>(statisticsService.getUserCountByRole(), HttpStatus.OK);
    }

    /**
     * Retrieves the count of tour guides by their department.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a map of departments and their respective tour guide counts.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the tour guide counts by department or error status.
     */
    @GetMapping("/tourGuideCountByDepartment")
    public ResponseEntity<?> getTourGuideCountByDepartment() {
        return new ResponseEntity<>(statisticsService.getTourGuideCountByDepartment(), HttpStatus.OK);
    }

    /**
     * Retrieves the count of tour guides by their grade.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a map of grades and their respective tour guide counts.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the tour guide counts by grade or error status.
     */
    @GetMapping("/tourGuideCountByGrade")
    public ResponseEntity<?> getTourGuideCountByGrade() {
        return new ResponseEntity<>(statisticsService.getTourGuideCountByGrade(), HttpStatus.OK);
    }

    /**
     * Retrieves the count of tour applications by their status.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a map of application statuses and their respective counts.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the tour application counts by status or error status.
     */
    @GetMapping("/tourApplicationCountByStatus")
    public ResponseEntity<?> getTourApplicationCountByStatus() {
        return new ResponseEntity<>(statisticsService.getTourApplicationCountByStatus(), HttpStatus.OK);
    }

    /**
     * Retrieves the count of tour applications by their type.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a map of application types and their respective counts.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the tour application counts by type or error status.
     */
    @GetMapping("/tourApplicationCountByType")
    public ResponseEntity<?> getTourApplicationCountByType() {
        return new ResponseEntity<>(statisticsService.getTourApplicationCountByType(), HttpStatus.OK);
    }

    /**
     * Retrieves the count of tours by high school.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a map of high schools and their respective tour counts.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the tour counts by high school or error status.
     */
    @GetMapping("/tourCountByHighSchool")
    public ResponseEntity<?> getTourCountByHighSchool() {
        return new ResponseEntity<>(statisticsService.getTourCountByHighSchool(), HttpStatus.OK);
    }

    /**
     * Retrieves the count of high schools by city.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a map of cities and their respective high school counts.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the high school counts by city or error status.
     */
    @GetMapping("/highSchoolCountByCity")
    public ResponseEntity<?> getHighSchoolCountByCity() {
        return new ResponseEntity<>(statisticsService.getHighSchoolCountByCity(), HttpStatus.OK);
    }

    /**
     * Retrieves the count of feedbacks by their rating.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a map of ratings and their respective feedback counts.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the feedback counts by rating or error status.
     */
    @GetMapping("/feedbackCountByRating")
    public ResponseEntity<?> getFeedbackCountByRating() {
        return new ResponseEntity<>(statisticsService.getFeedbackCountByRating(), HttpStatus.OK);
    }

    /**
     * Retrieves the count of fair invitations by their status.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a map of invitation statuses and their respective counts.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the fair invitation counts by status or error status.
     */
    @GetMapping("/fairInvitationCountByStatus")
    public ResponseEntity<?> getFairInvitationCountByStatus() {
        return new ResponseEntity<>(statisticsService.getFairInvitationCountByStatus(), HttpStatus.OK);
    }

    /**
     * Retrieves the count of tours by month.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a map of months and their respective tour counts.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the tour counts by month or error status.
     */
    @GetMapping("/tourCountByMonth")
    public ResponseEntity<?> getTourCountByMonth() {
        return new ResponseEntity<>(statisticsService.getTourCountByMonth(), HttpStatus.OK);
    }

    /**
     * Retrieves the count of fairs by month.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a map of months and their respective fair counts.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the fair counts by month or error status.
     */
    @GetMapping("/fairCountByMonth")
    public ResponseEntity<?> getFairCountByMonth() {
        return new ResponseEntity<>(statisticsService.getFairCountByMonth(), HttpStatus.OK);
    }

    /**
     * Retrieves the payment amounts by month.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a map of months and their respective payment amounts.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the payment amounts by month or error status.
     */
    @GetMapping("/paymentAmountByMonth")
    public ResponseEntity<?> getPaymentAmountByMonth() {
        return new ResponseEntity<>(statisticsService.getPaymentAmountByMonth(), HttpStatus.OK);
    }
}

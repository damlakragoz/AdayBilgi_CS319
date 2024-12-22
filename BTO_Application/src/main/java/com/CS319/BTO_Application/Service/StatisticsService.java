package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.*;
import java.time.LocalDate;
import java.time.format.TextStyle;

@Service
public class StatisticsService {
    private final UserRepos userRepos;
    private final TourApplicationRepos tourApplicationRepos;
    private final SchoolTourApplicationRepos schoolTourApplicationRepos;
    private final IndividualTourApplicationRepos individualTourApplicationRepos;
    private final PaymentRepos paymentRepos;
    private final FairRepos fairRepos;
    private final FeedbackRepos feedbackRepos;
    private final TourGuideRepos tourGuideRepos;
    private final AdvisorRepos advisorRepos;
    private final CoordinatorRepos coordinatorRepos;
    private final ExecutiveRepos executiveRepos;
    private final CounselorRepos counselorRepos;
    private final SchoolTourRepos schoolTourRepos;
    private final HighschoolRepos highschoolRepos;
    private final FairInvitationRepos fairInvitationRepos;


    @Autowired
    public StatisticsService(UserRepos userRepos, TourApplicationRepos tourApplicationRepos,
                             SchoolTourApplicationRepos schoolTourApplicationRepos,
                             IndividualTourApplicationRepos individualTourApplicationRepos,
                             PaymentRepos paymentRepos, FairRepos fairRepos,
                             FeedbackRepos feedbackRepos,
                             TourGuideRepos tourGuideRepos, AdvisorRepos advisorRepos,
                             CoordinatorRepos coordinatorRepos, ExecutiveRepos executiveRepos,
                             CounselorRepos counselorRepos, SchoolTourRepos schoolTourRepos,
                             HighschoolRepos highschoolRepos, FairInvitationRepos fairInvitationRepos) {
        this.userRepos = userRepos;
        this.tourApplicationRepos = tourApplicationRepos;
        this.schoolTourApplicationRepos = schoolTourApplicationRepos;
        this.individualTourApplicationRepos = individualTourApplicationRepos;
        this.paymentRepos = paymentRepos;
        this.fairRepos = fairRepos;
        this.feedbackRepos = feedbackRepos;
        this.tourGuideRepos = tourGuideRepos;
        this.advisorRepos = advisorRepos;
        this.coordinatorRepos = coordinatorRepos;
        this.executiveRepos = executiveRepos;
        this.counselorRepos = counselorRepos;
        this.schoolTourRepos = schoolTourRepos;
        this.highschoolRepos = highschoolRepos;
        this.fairInvitationRepos = fairInvitationRepos;
    }

    /**
     * Retrieves the count of users categorized by their roles.
     *
     * Preconditions:
     * - All repositories for user roles must be properly initialized.
     *
     * Postconditions:
     * - Returns a map with role names as keys and their respective counts as values.
     *
     * @return A map of role names to their respective user counts.
     */
    public Map<String, Integer> getUserCountByRole() {
        Map<String, Integer> userCounts = new HashMap<>();

        int advisorCount = advisorRepos.findAllAdvisors().size();
        int tourGuideCount = tourGuideRepos.findAllTourGuides().size() - advisorCount; // findAllTourGuides() returns tourGuide
        int coordinatorCount = coordinatorRepos.findAll().size();
        int executiveCount = executiveRepos.findAll().size();
        int counselorCount = counselorRepos.findAll().size();

        userCounts.put("Danışman", advisorCount);
        userCounts.put("Tur Rehberi", tourGuideCount);
        userCounts.put("Kordinatör", coordinatorCount);
        userCounts.put("Yönetici", executiveCount);
        userCounts.put("Rehber Öğretmen", counselorCount);

        for (TourGuide tourGuide : tourGuideRepos.findAll()) {
            System.out.println(tourGuide.getDepartment());
        }

        return userCounts;
    }


    /**
     * Retrieves the count of tour guides categorized by their department.
     *
     * Preconditions:
     * - Tour guides must have valid department information.
     *
     * Postconditions:
     * - Returns a map sorted in descending order of counts.
     *
     * @return A map of department names to their respective tour guide counts.
     */
    public Map<String, Integer> getTourGuideCountByDepartment() {
        List<TourGuide> tourGuides = tourGuideRepos.findAllTourGuides();
        Map<String, Integer> guidesByDepartment = new HashMap<>();

        if (tourGuides != null) {
            for (TourGuide guide : tourGuides) {

                if (guide == null) {
                    System.out.println("Skipping null or empty guide");
                    continue; // Skip to the next iteration
                }

                String department = guide.getDepartment();

                // Skip if the department is null
                if (department == null || department.trim().isEmpty()) {
                    System.out.println("Skipping null or empty department");
                    continue; // Skip to the next iteration
                }

                // Check if the department exists in the map; if not, add it with a count of 0
                if (!guidesByDepartment.containsKey(department)) {
                    guidesByDepartment.put(department, 0);
                }

                // Increment the count for the department
                int currentCount = guidesByDepartment.get(department);
                if (currentCount >= 0){
                    guidesByDepartment.put(department, currentCount + 1);
                }

                System.out.println(department);
            }

        }

        return sortByValueDescending(guidesByDepartment);
    }

    /**
     * Retrieves the count of tour guides categorized by their grade levels (1 to 4).
     *
     * Preconditions:
     * - Tour guides must have valid grade information between 1 and 4.
     *
     * Postconditions:
     * - Returns a map where keys are grade levels, and values are the count of tour guides in each grade.
     *
     * @return A map of grade levels to their respective tour guide counts.
     */
    public Map<Integer, Integer> getTourGuideCountByGrade() {
        List<TourGuide> tourGuides = tourGuideRepos.findAllTourGuides();
        Map<Integer, Integer> guidesByGrade = new LinkedHashMap<>();

        guidesByGrade.put(1, 0);
        guidesByGrade.put(2, 0);
        guidesByGrade.put(3, 0);
        guidesByGrade.put(4, 0);

        if (tourGuides != null) {
            for (TourGuide guide : tourGuides) {

                if (guide == null) {
                    System.out.println("Skipping null or empty guide");
                    continue; // Skip to the next iteration
                }

                int grade = guide.getGrade(); // Retrieve the grade of the tour guide

                // Skip if the grade is not in the true range
                if (grade < 1 || grade > 4) {
                    System.out.println("Skipping");
                    continue; // Skip to the next iteration
                }

                // Check if the grade exists in the map; if not, add it with a count of 0
                if (!guidesByGrade.containsKey(grade)) {
                    guidesByGrade.put(grade, 0);
                }

                // Increment the count for the grade
                int currentCount = guidesByGrade.get(grade);
                if (currentCount >= 0) {
                    guidesByGrade.put(grade, currentCount + 1);
                }
            }
        }

        return guidesByGrade;
    }

    /**
     * Retrieves the count of tour applications categorized by their statuses.
     *
     * Preconditions:
     * - Tour applications must have valid status fields.
     *
     * Postconditions:
     * - Returns a map with application statuses as keys and their counts as values.
     *
     * @return A map of tour application statuses to their respective counts.
     */
    public Map<String, Integer> getTourApplicationCountByStatus() {
        List<TourApplication> tourApplications = tourApplicationRepos.findAll();
        Map<String, Integer> tourApplicationsByStatus = new LinkedHashMap<>();

        tourApplicationsByStatus.put("Created", 0);
        tourApplicationsByStatus.put("Pending", 0);
        tourApplicationsByStatus.put("Approved", 0);
        tourApplicationsByStatus.put("Rejected", 0);
        tourApplicationsByStatus.put("Finished", 0);
        tourApplicationsByStatus.put("Cancelled", 0);

        if (tourApplications != null) {
            for (TourApplication tourApplication : tourApplications) {

                if (tourApplication == null) {
                    System.out.println("Skipping null or empty tour application");
                    continue; // Skip to the next iteration
                }

                String status = tourApplication.getApplicationStatus();

                // Skip if the status is null
                if (status == null || status.trim().isEmpty()) {
                    System.out.println("Skipping null or empty status");
                    continue; // Skip to the next iteration
                }

                // Check if the status exists in the map; if not, add it with a count of 0
                if (!tourApplicationsByStatus.containsKey(status)) {
                    tourApplicationsByStatus.put(status, 0);
                }

                // Increment the count for the status
                int currentCount = tourApplicationsByStatus.get(status);
                if (currentCount >= 0){
                    tourApplicationsByStatus.put(status, currentCount + 1);
                }
            }
        }

        return tourApplicationsByStatus;
    }

    /**
     * Retrieves the count of tour applications categorized by their type (school or individual).
     *
     * Preconditions:
     * - Both school and individual tour application repositories must be initialized and accessible.
     *
     * Postconditions:
     * - Returns a map where keys are application types, and values are the count of each type.
     *
     * @return A map of application types to their respective counts.
     */
    public Map<String, Integer> getTourApplicationCountByType() {
        Map<String, Integer> tourApplicationsByType = new HashMap<>();

        int schoolTourApplicationCount = schoolTourApplicationRepos.findAll().size();
        int individualTourApplicationCount = individualTourApplicationRepos.findAll().size();

        tourApplicationsByType.put("Okul Tur Başvuru Sayısı", schoolTourApplicationCount);
        tourApplicationsByType.put("Bireysel Tur Başvuru Sayısı", individualTourApplicationCount);

        return tourApplicationsByType;
    }

    /**
     * Retrieves the count of tours categorized by the high schools that applied for them.
     *
     * Preconditions:
     * - Tours must have valid high school information associated with them.
     *
     * Postconditions:
     * - Returns a map where keys are high school names, and values are the count of tours for each school.
     * - Only "Finished" tours are considered.
     *
     * @return A map of high school names to their respective tour counts.
     */
    public Map<String, Integer> getTourCountByHighSchool() {
        Map<String, Integer> toursByHighSchool = new HashMap<>();

        List<Tour> tours = schoolTourRepos.findAll();

        if (tours != null) {
            for (Tour tour : tours) {
                if (tour == null) {
                    System.out.println("Skipping null or empty tour");
                    continue; // Skip to the next iteration
                }

                if (tour.getTourStatus().equals("Finished")) {
                    String highSchoolName = tour.getApplyingHighschoolName();

                    // Skip if the high school name is null
                    if (highSchoolName == null || highSchoolName.trim().isEmpty()) {
                        System.out.println("Skipping null or empty high school name");
                        continue; // Skip to the next iteration
                    }

                    // Check if the high school exists in the map; if not, add it with a count of 0
                    if (!toursByHighSchool.containsKey(highSchoolName)) {
                        toursByHighSchool.put(highSchoolName, 0);
                    }

                    // Increment the count for the school
                    int currentCount = toursByHighSchool.get(highSchoolName);
                    if (currentCount >= 0){
                        toursByHighSchool.put(highSchoolName, currentCount + 1);
                    }
                }

            }
        }

        return sortByValueDescending(toursByHighSchool);
    }

    /**
     * Retrieves the count of high schools categorized by their city.
     *
     * Preconditions:
     * - High schools must have valid city information associated with them.
     *
     * Postconditions:
     * - Returns a map where keys are city names, and values are the count of high schools in each city.
     *
     * @return A map of city names to their respective high school counts.
     */
    public Map<String, Integer> getHighSchoolCountByCity() {
        Map<String, Integer> highSchoolsByCity = new HashMap<>();

        List<HighSchool> highSchools = highschoolRepos.findAll();

        if (highSchools != null) {
            for (HighSchool highSchool : highSchools) {

                if (highSchool == null) {
                    System.out.println("Skipping null or empty high school");
                    continue; // Skip to the next iteration
                }

                String city = highSchool.getCity();

                // Skip if the high school city is null
                if (city == null || city.trim().isEmpty()) {
                    System.out.println("Skipping null or empty high school name");
                    continue; // Skip to the next iteration
                }

                // Check if the city exists in the map; if not, add it with a count of 0
                if (!highSchoolsByCity.containsKey(city)) {
                    highSchoolsByCity.put(city, 0);
                }

                // Increment the count for the city
                int currentCount = highSchoolsByCity.get(city);
                if (currentCount >= 0){
                    highSchoolsByCity.put(city, currentCount + 1);
                }
            }
        }

        return sortByValueDescending(highSchoolsByCity);
    }

    /**
     * Retrieves the count of feedback entries categorized by their rating (1 to 5).
     *
     * Preconditions:
     * - Feedback entries must have valid rating values between 1 and 5.
     *
     * Postconditions:
     * - Returns a map where keys are rating values, and values are the count of feedback entries for each rating.
     *
     * @return A map of rating values to their respective feedback counts.
     */
    public Map<Integer, Integer> getFeedbackCountByRating() {
        Map<Integer, Integer> feedbackByRating = new HashMap<>();
        feedbackByRating.put(0, 0);
        feedbackByRating.put(1, 0);
        feedbackByRating.put(2, 0);
        feedbackByRating.put(3, 0);
        feedbackByRating.put(4, 0);
        feedbackByRating.put(5, 0);


        List<Feedback> feedbacks = feedbackRepos.findAll();

        if (feedbacks != null) {
            for (Feedback feedback : feedbacks) {

                if (feedback == null) {
                    System.out.println("Skipping null or empty feedback");
                    continue; // Skip to the next iteration
                }

                int rating = feedback.getRating();

                // Skip if the rating is not in the true range
                if (rating < 1 || rating > 5) {
                    System.out.println("Skipping");
                    continue; // Skip to the next iteration
                }

                // Check if the rating exists in the map; if not, add it with a count of 0
                if (!feedbackByRating.containsKey(rating)) {
                    feedbackByRating.put(rating, 0);
                }

                // Increment the count for the rating
                int currentCount = feedbackByRating.get(rating);
                if (currentCount >= 0){
                    feedbackByRating.put(rating, currentCount + 1);
                }
            }
        }

        return feedbackByRating;
    }

    /**
     * Retrieves the count of fair invitations categorized by their statuses (e.g., "Created", "Rejected").
     *
     * Preconditions:
     * - Fair invitations must have valid status information.
     *
     * Postconditions:
     * - Returns a map where keys are invitation statuses, and values are the count of invitations for each status.
     *
     * @return A map of invitation statuses to their respective counts.
     */
    public Map<String, Integer> getFairInvitationCountByStatus() {
        List<FairInvitation> fairInvitations = fairInvitationRepos.findAll();
        Map<String, Integer> fairInvitationByStatus = new LinkedHashMap<>();

        fairInvitationByStatus.put("Created", 0);
        fairInvitationByStatus.put("Rejected", 0);
        fairInvitationByStatus.put("Cancelled", 0);
        fairInvitationByStatus.put("Approved", 0);

        if (fairInvitations != null) {
            for (FairInvitation fairInvitation : fairInvitations) {

                if (fairInvitation == null) {
                    System.out.println("Skipping null or empty fair invitation");
                    continue; // Skip to the next iteration
                }

                String status = fairInvitation.getFairInvitationStatus();

                // Skip if the fair invitation status is null
                if (status == null || status.trim().isEmpty()) {
                    System.out.println("Skipping null or empty fair invitation status");
                    continue; // Skip to the next iteration
                }

                // Check if the status exists in the map; if not, add it with a count of 0
                if (!fairInvitationByStatus.containsKey(status)) {
                    fairInvitationByStatus.put(status, 0);
                }

                // Increment the count for the status
                int currentCount = fairInvitationByStatus.get(status);
                if (currentCount >= 0){
                    fairInvitationByStatus.put(status, currentCount + 1);
                }
            }
        }

        return fairInvitationByStatus;
    }

    /**
     * Retrieves the count of tours categorized by the month they were selected within the last 12 months.
     *
     * Preconditions:
     * - Tour applications must have valid selected dates.
     *
     * Postconditions:
     * - Returns a map where keys are month-year combinations, and values are the count of tours in each month.
     * - Only tours selected within the last 12 months are considered.
     *
     * @return A map of month-year to tour counts.
     */
    public Map<String, Integer> getTourCountByMonth() {
        Map<String, Integer> toursByMonth = initializeMonthMap();

        List<TourApplication> tourApplications = tourApplicationRepos.findAll();

        if (tourApplications != null) {
            for (TourApplication tourApplication : tourApplications) {
                if (tourApplication == null) {
                    System.out.println("Skipping null or empty tour application");
                    continue;
                }

                LocalDate selectedDate = tourApplication.getSelectedDate();

                if (selectedDate == null) {
                    System.out.println("Skipping null or empty tour application date");
                    continue;
                }

                // Get the start date (12 months ago) and today's date
                LocalDate now = LocalDate.now();
                LocalDate startDate = now.minusMonths(11);

                // Check if the date falls within the last 12 months
                if (!selectedDate.isBefore(startDate) && !selectedDate.isAfter(now)) {
                    // Get the corresponding month and year
                    String monthNameTurkish = selectedDate.getMonth()
                            .getDisplayName(TextStyle.FULL, new Locale("tr", "TR"));
                    String mapKey = monthNameTurkish + " " + selectedDate.getYear();

                    // Increment the count for the corresponding month
                    toursByMonth.put(mapKey, toursByMonth.getOrDefault(mapKey, 0) + 1);
                }

            }
        }

        return toursByMonth;
    }


    /**
     * Retrieves the count of fairs categorized by the month they were scheduled within the last 12 months.
     *
     * Preconditions:
     * - Fair invitations must have valid start dates.
     *
     * Postconditions:
     * - Returns a map where keys are month-year combinations, and values are the count of fairs in each month.
     * - Only fairs scheduled within the last 12 months are considered.
     *
     * @return A map of month-year to fair counts.
     */
    public Map<String, Integer> getFairCountByMonth() {
        Map<String, Integer> fairsByMonth = initializeMonthMap();

        List<FairInvitation> fairInvitations = fairInvitationRepos.findAll();

        if (fairInvitations != null) {
            for (FairInvitation fairInvitation : fairInvitations) {
                if (fairInvitation == null) {
                    System.out.println("Skipping null or empty fair invitation");
                    continue;
                }

                LocalDate selectedDate = fairInvitation.getFairStartDate();

                if (selectedDate == null) {
                    System.out.println("Skipping null or empty fair invitation date");
                    continue;
                }

                LocalDate now = LocalDate.now();
                LocalDate startDate = now.minusMonths(11);

                if (!selectedDate.isBefore(startDate) && !selectedDate.isAfter(now)) {
                    // Get the corresponding month and year
                    String monthNameTurkish = selectedDate.getMonth()
                            .getDisplayName(TextStyle.FULL, new Locale("tr", "TR"));
                    String mapKey = monthNameTurkish + " " + selectedDate.getYear();

                    // Increment the count for the corresponding month
                    fairsByMonth.put(mapKey, fairsByMonth.getOrDefault(mapKey, 0) + 1);
                }

            }
        }

        return fairsByMonth;
    }

    /**
     * Retrieves the count of payments categorized by the month in which they were approved.
     *
     * Preconditions:
     * - Payments must have valid approval dates.
     *
     * Postconditions:
     * - Returns a map with month-year as keys and the total payment amounts as values.
     *
     * @return A map of month-year to total payment amounts.
     */
    public Map<String, Double> getPaymentAmountByMonth() {
        Map<String, Double> paymentByMonth = initializeMonthMapDouble();

        List<Payment> payments = paymentRepos.findAll();

        if (payments != null) {
            for (Payment payment : payments) {
                if (payment == null) {
                    System.out.println("Skipping null or empty payment payment");
                    continue;
                }

                Date paymentDate = payment.getApprovalDate();

                if (paymentDate == null) {
                    System.out.println("Skipping null or empty payment date");
                    continue;
                }

                // Convert Date to LocalDate
                LocalDate localPaymentDate = paymentDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

                // Define the start date and end date (last 12 months range)
                LocalDate now = LocalDate.now();
                LocalDate startDate = now.minusMonths(11);

                // Check if the payment date is within the last 12 months
                if (!localPaymentDate.isBefore(startDate) && !localPaymentDate.isAfter(now)) {
                    // Get the corresponding month and year
                    String monthNameTurkish = localPaymentDate.getMonth()
                            .getDisplayName(TextStyle.FULL, new Locale("tr", "TR"));
                    String mapKey = monthNameTurkish + " " + localPaymentDate.getYear();

                    // Add the payment amount to the corresponding month
                    double currentAmount = paymentByMonth.getOrDefault(mapKey, 0.0);
                    if (payment.getAmount() != null) {
                        paymentByMonth.put(mapKey, currentAmount + payment.getAmount());
                    }
                }
            }
        }

        return paymentByMonth;
    }

    /**
     * Initializes a map for the last 12 months with keys as month-year combinations and values as zero.
     *
     * Postconditions:
     * - Returns a map where keys are month-year combinations, and values are initialized to zero.
     *
     * @return A map of month-year to zero values.
     */
    private Map<String, Integer> initializeMonthMap() {
        Map<String, Integer> monthMap = new LinkedHashMap<>();

        // Get today's date
        LocalDate now = LocalDate.now();

        // Calculate the start date: 11 months before the current month
        LocalDate startDate = now.minusMonths(11);

        // Loop over the last 12 months
        for (int i = 0; i < 12; i++) {
            LocalDate monthDate = startDate.plusMonths(i); // Move forward from the start date

            // Get the month name in Turkish
            String monthNameTurkish = monthDate.getMonth()
                    .getDisplayName(TextStyle.FULL, new Locale("tr", "TR"));

            // Construct the key (e.g., "Şubat 2023")
            String mapKey = monthNameTurkish + " " + monthDate.getYear();

            // Add the month to the map with an initial count of 0
            monthMap.put(mapKey, 0);
        }

        return monthMap;
    }

    /**
     * Helper method to initialize a map for the last 12 months with zero values.
     *
     * Postconditions:
     * - A map with the last 12 months as keys and values initialized to zero is returned.
     *
     * @return A map of month-year keys with values set to zero.
     */
    private Map<String, Double> initializeMonthMapDouble() {
        Map<String, Double> monthMap = new LinkedHashMap<>();

        // Get today's date
        LocalDate now = LocalDate.now();

        // Calculate the start date: 11 months before the current month
        LocalDate startDate = now.minusMonths(11);

        // Loop over the last 12 months
        for (int i = 0; i < 12; i++) {
            LocalDate monthDate = startDate.plusMonths(i); // Move forward from the start date

            // Get the month name in Turkish
            String monthNameTurkish = monthDate.getMonth()
                    .getDisplayName(TextStyle.FULL, new Locale("tr", "TR"));

            // Construct the key (e.g., "Şubat 2023")
            String mapKey = monthNameTurkish + " " + monthDate.getYear();

            // Add the month to the map with an initial count of 0
            monthMap.put(mapKey, 0.0);
        }

        return monthMap;
    }

    /**
     * Helper method to sort a map by its values in descending order.
     *
     * @param map The map to be sorted.
     * @return A new map sorted by its values in descending order.
     */    private Map<String, Integer> sortByValueDescending(Map<String, Integer> map) {
        List<Map.Entry<String, Integer>> entryList = new ArrayList<>(map.entrySet());

        // Sort the list by value in descending order
        entryList.sort((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue()));

        // Create a LinkedHashMap to maintain the sorted order
        Map<String, Integer> sortedMap = new LinkedHashMap<>();
        for (Map.Entry<String, Integer> entry : entryList) {
            sortedMap.put(entry.getKey(), entry.getValue());
        }

        return sortedMap;
    }

}

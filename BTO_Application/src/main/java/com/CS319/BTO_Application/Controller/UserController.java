package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.*;
import com.CS319.BTO_Application.Entity.*;
//import com.CS319.BTO_Application.Service.UserService;
import com.CS319.BTO_Application.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.security.SecureRandom;
import java.util.Random;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final CounselorService counselorService;
    private final CoordinatorService coordinatorService;
    private final TourGuideService tourGuideService;
    private final HighSchoolService highschoolService;
    private final AdvisorService advisorService;
    private final ExecutiveService executiveService;
    private final MailService mailService;

    @Autowired
    public UserController(UserService userService, CounselorService counselorService,
                          CoordinatorService coordinatorService, TourGuideService tourGuideService,
                          HighSchoolService highschoolService, AdvisorService advisorService, ExecutiveService executiveService, MailService mailService) {
        this.userService = userService;
        this.counselorService = counselorService;
        this.coordinatorService = coordinatorService;
        this.tourGuideService = tourGuideService;
        this.highschoolService = highschoolService;
        this.advisorService = advisorService;
        this.executiveService = executiveService;
        this.mailService = mailService;
    }


    /**
     * Retrieves all users.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a list of all users.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the list of all users or error status.
     */
    @GetMapping("/users/getAll")
    public ResponseEntity<?> getAllUsers() {
        try {
            // Fetch all counselors from the service
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users); // Return the list of counselors with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving users.");
        }
    }

    /**
     * Retrieves a user by email.
     *
     * Preconditions:
     * - `email` must not be null and must correspond to an existing user.
     *
     * Postconditions:
     * - Returns the user details.
     * - If the user does not exist, returns status 404 (NOT_FOUND).
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param email The email of the user.
     * @return ResponseEntity containing the user details or error status.
     */
    @GetMapping("/users/getByEmail")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        try {
            // Fetch the user by email from the service
            User user = userService.getUserByUsername(email);  // Adjust this according to your service method

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found with email: " + email);
            }

            return ResponseEntity.ok(user); // Return the user details with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving the user.");
        }
    }

    /**
     * Changes the password of a user.
     *
     * Preconditions:
     * - `currentPassword`, `newPassword`, and `username` must not be null.
     * - `currentPassword` must match the user's current password.
     *
     * Postconditions:
     * - The user's password is updated.
     * - If the current password is incorrect, returns status 401 (UNAUTHORIZED).
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param currentPassword The current password of the user.
     * @param newPassword The new password for the user.
     * @param username The username of the user.
     * @return ResponseEntity containing the success message or error status.
     */
    @PutMapping("/user/changePassword")
    public ResponseEntity<?> changePassword(@RequestParam String currentPassword, @RequestParam String newPassword, @RequestParam String username) {
        try {
            User user = userService.getUserByUsername(username);
            if (!userService.checkPassword(user, currentPassword)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Password is incorrect");
            }
            userService.updatePassword(user, newPassword);
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while changing the password");
        }
    }

    /**
     * Sends a reset code to the user's email for password recovery.
     *
     * Preconditions:
     * - `email` must not be null and must correspond to an existing user.
     *
     * Postconditions:
     * - A reset code is sent to the user's email.
     * - If the user does not exist, returns status 404 (NOT_FOUND).
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param email The email of the user.
     * @return ResponseEntity containing the success message or error status.
     */
    @PostMapping("/user/forgotPassword")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            User user = userService.getUserByUsername(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Email does not exist.");
            }

            userService.sendResetCode(email);
            return ResponseEntity.ok("Reset code sent.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while sending reset code.");
        }
    }


    /**
     * Resets the password of a user using a reset code.
     *
     * Preconditions:
     * - `email`, `code`, and `newPassword` must not be null.
     * - `code` must be valid for the given `email`.
     *
     * Postconditions:
     * - The user's password is updated.
     * - If the code is invalid, returns status 400 (BAD_REQUEST).
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param email The email of the user.
     * @param code The reset code sent to the user's email.
     * @param newPassword The new password for the user.
     * @return ResponseEntity containing the success message or error status.
     */
    @PutMapping("/user/resetPassword")
    public ResponseEntity<?> resetPassword(
            @RequestParam String email,
            @RequestParam String code,
            @RequestParam String newPassword) {
        try {
            if (!userService.verifyResetCode(email, code)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid code or email.");
            }

            userService.resetPassword(email, newPassword, code);
            return ResponseEntity.ok("Pasword changed successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while resetting password.");
        }
    }

    /**
     * Retrieves all counselors.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a list of all counselors.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the list of all counselors or error status.
     */
    @GetMapping("/counselors/getAll")
    public ResponseEntity<?> getAllCounselors() {
        try {
            // Fetch all counselors from the service
            List<Counselor> counselors = counselorService.getAllCounselors();
            counselors.forEach(counselor -> {
                System.out.println("Counselor: " + counselor.getEmail() + ", HighSchool: " + counselor.getHighSchool() );
            });
            return ResponseEntity.ok(counselors); // Return the list of counselors with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving counselors.");
        }
    }

    /**
     * Registers a new counselor.
     *
     * Preconditions:
     * - `counselorRegister` must not be null.
     * - `counselorRegister.email` must be unique.
     * - `counselorRegister.schoolName` must correspond to an existing high school.
     *
     * Postconditions:
     * - The counselor is registered and saved.
     * - If the email is already taken, returns status 400 (BAD_REQUEST).
     * - If the high school does not exist, returns status 400 (BAD_REQUEST).
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param counselorRegister The registration details of the counselor.
     * @return ResponseEntity containing the registered counselor or error status.
     */
    @PostMapping("/counselor/register")
    public ResponseEntity<?> registerCounselor(@RequestBody CounselorRegister counselorRegister) {
        // Check if the username is already taken
        if (userService.getUserByUsername(counselorRegister.getEmail()) != null) {
            return ResponseEntity.status(400).body("Username is already taken");
        }
        if(highschoolService.getSchoolByName(counselorRegister.getSchoolName()) == null){
            return ResponseEntity.status(400).body("Highschool does not exist");
        }
        HighSchool highSchool = highschoolService.getSchoolByName(counselorRegister.getSchoolName());
        Counselor counselor = new Counselor(counselorRegister.getEmail(), counselorRegister.getPassword(),
                counselorRegister.getFirstName(), counselorRegister.getLastName(),
                counselorRegister.getPhoneNumber(), counselorRegister.getRole(), highSchool);
        // Save the user to the database
        return new ResponseEntity<>(counselorService.saveCounselor(counselor), HttpStatus.CREATED);
    }

    /**
     * Deletes a counselor by username.
     *
     * Preconditions:
     * - `username` must not be null and must correspond to an existing counselor.
     *
     * Postconditions:
     * - The counselor is deleted.
     * - If the counselor does not exist, returns status 400 (BAD_REQUEST).
     *
     * @param username The username of the counselor.
     * @return ResponseEntity containing the success message or error status.
     */
    @DeleteMapping("/counselor/delete")
    public ResponseEntity<?> deleteCounselor(@RequestParam String username) {
        if (counselorService.getCounselorByUsername(username) == null) {
            return ResponseEntity.status(400).body("Counselor With Username "+username+"Not Found");
        }
        counselorService.deleteCounselorByUsername(username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Counselor Methods END
////////////////////////////
// Coordinator Methods START

    /**
     * Registers a new coordinator.
     *
     * Preconditions:
     * - `btoMemberRegister` must not be null.
     * - `btoMemberRegister.email` must be unique.
     *
     * Postconditions:
     * - The coordinator is registered and saved.
     * - If the email is already taken, returns status 400 (BAD_REQUEST).
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param btoMemberRegister The registration details of the coordinator.
     * @return ResponseEntity containing the registered coordinator or error status.
     */
    @PostMapping("/coordinator/register")
    public ResponseEntity<?> registerCoordinator(@RequestBody BTOMemberRegister btoMemberRegister) {
        if (userService.getUserByUsername(btoMemberRegister.getEmail()) != null) {
            return ResponseEntity.status(400).body("Username for coordinator is already taken");
        }

        // Generate a random password if no password provided
        String password = btoMemberRegister.getPassword()==null ? generateRandomPassword(10) : btoMemberRegister.getPassword(); // Password length is 10 characters


        Coordinator coordinator = new Coordinator(
                btoMemberRegister.getEmail(),
                password,
                btoMemberRegister.getFirstName(),
                btoMemberRegister.getLastName(),
                btoMemberRegister.getPhoneNumber(),
                "Coordinator"
        );

        if (btoMemberRegister.getPassword()==null){
            // Send the password to the user's email
            String subject = "BTO Hesap Bilgileriniz";
            String text = String.format(
                    "Merhaba %s %s,\n\nBTO sistemine giriş yapabilmeniz için şifreniz: %s\n\nLütfen şifrenizi en kısa sürede değiştiriniz.",
                    btoMemberRegister.getFirstName(),
                    btoMemberRegister.getLastName(),
                    password
            );

            try {
                System.out.println(btoMemberRegister.getEmail());
                mailService.sendMail(btoMemberRegister.getEmail(), subject, text);
                return new ResponseEntity<>(coordinatorService.saveCoordinator(coordinator), HttpStatus.CREATED);
            } catch (Exception e) {
                // If email fails, still return a success response but log the issue
                e.printStackTrace();
                return ResponseEntity.status(201).body("Executive created, but failed to send email.");
            }
        } else {
            return new ResponseEntity<>(coordinatorService.saveCoordinator(coordinator), HttpStatus.CREATED);
        }
    }

    /**
     * Registers a new executive.
     *
     * Preconditions:
     * - `btoMemberRegister` must not be null.
     * - `btoMemberRegister.email` must be unique.
     *
     * Postconditions:
     * - The executive is registered and saved.
     * - If the email is already taken, returns status 400 (BAD_REQUEST).
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param btoMemberRegister The registration details of the executive.
     * @return ResponseEntity containing the registered executive or error status.
     */
    @PostMapping("/executive/register")
    private ResponseEntity<?> registerExecutive(@RequestBody BTOMemberRegister btoMemberRegister) {
        // Check for unique username
        if (userService.getUserByUsername(btoMemberRegister.getEmail()) != null) {
            return ResponseEntity.status(400).body("Username for executive is already taken");
        }

        // Generate a random password if no password provided
        String password = btoMemberRegister.getPassword()==null ? generateRandomPassword(10) : btoMemberRegister.getPassword(); // Password length is 10 characters

        Executive executive = new Executive(
                btoMemberRegister.getEmail(),
                password,
                btoMemberRegister.getFirstName(),
                btoMemberRegister.getLastName(),
                btoMemberRegister.getPhoneNumber(),
                "Executive"
        );

        if (btoMemberRegister.getPassword()==null){
            // Send the password to the user's email
            String subject = "BTO Hesap Bilgileriniz";
            String text = String.format(
                    "Merhaba %s %s,\n\nBTO sistemine giriş yapabilmeniz için şifreniz: %s\n\nLütfen şifrenizi en kısa sürede değiştiriniz.",
                    btoMemberRegister.getFirstName(),
                    btoMemberRegister.getLastName(),
                    password
            );

            try {
                System.out.println(btoMemberRegister.getEmail());
                mailService.sendMail(btoMemberRegister.getEmail(), subject, text);
                return new ResponseEntity<>(executiveService.saveExecutive(executive), HttpStatus.CREATED);
            } catch (Exception e) {
                // If email fails, still return a success response but log the issue
                e.printStackTrace();
                return ResponseEntity.status(201).body("Executive created, but failed to send email.");
            }
        } else {
            // Save the Executive to the database
            return new ResponseEntity<>(executiveService.saveExecutive(executive), HttpStatus.CREATED);
        }
    }

    /**
     * Retrieves all executives.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a list of all executives.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the list of all executives or error status.
     */
    @GetMapping("/executive/getAll")
    public ResponseEntity<?> getAllExecutives() {
        try {
            // Fetch all tour guides from the service
            List<Executive> executives = executiveService.getAllExecutives();
            executives.forEach(executive -> {
                System.out.println("Executive: " + executive.getEmail());
            });
            return ResponseEntity.ok(executives); // Return the list of tour guides with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour guides.");
        }
    }

    /**
     * Retrieves all coordinators.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a list of all coordinators.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the list of all coordinators or error status.
     */
    @GetMapping("/coordinator/getAll")
    public ResponseEntity<?> getAllCoordinators() {
        try {
            // Fetch all tour guides from the service
            List<Coordinator> coordinators = coordinatorService.getAllCoordinators();
            coordinators.forEach(coordinator -> {
                System.out.println("Coordinator: " + coordinator.getEmail());
            });
            return ResponseEntity.ok(coordinators); // Return the list of tour guides with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour guides.");
        }
    }

    /**
     * Deletes a coordinator by username.
     *
     * Preconditions:
     * - `username` must not be null and must correspond to an existing coordinator.
     *
     * Postconditions:
     * - The coordinator is deleted.
     * - If the coordinator does not exist, returns status 400 (BAD_REQUEST).
     *
     * @param username The username of the coordinator.
     * @return ResponseEntity containing the success message or error status.
     */
    @DeleteMapping("/coordinator/delete")
    public ResponseEntity<?> deleteCoordinator(@RequestParam String username) {
        if (coordinatorService.getCoordinatorByEmail(username) == null) {
            return ResponseEntity.status(400).body("Coordinator With Username "+username+"Not Found");
        }
        coordinatorService.deleteCoordinatorByUsername(username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    // Coordinator Methods END
////////////////////////
// TourGuide Methods START

    /**
     * Registers a new tour guide.
     *
     * Preconditions:
     * - `tourGuideRegister` must not be null.
     * - `tourGuideRegister.email` must be unique.
     *
     * Postconditions:
     * - The tour guide is registered and saved.
     * - If the email is already taken, returns status 400 (BAD_REQUEST).
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param tourGuideRegister The registration details of the tour guide.
     * @return ResponseEntity containing the registered tour guide or error status.
     */
    @PostMapping("/tourguide/register")
    public ResponseEntity<?> registerTourGuide(@RequestBody TourGuideRegister tourGuideRegister) {
        if (userService.getUserByUsername(tourGuideRegister.getEmail()) != null) {
            return ResponseEntity.status(400).body("Username for tour guide is already taken");
        }

        // Generate a random password
        String randomPassword = generateRandomPassword(10); // Password length is 10 characters

        TourGuide tourGuide = new TourGuide(
                tourGuideRegister.getEmail(),
                randomPassword,
                tourGuideRegister.getFirstName(),
                tourGuideRegister.getLastName(),
                tourGuideRegister.getPhoneNumber(),
                tourGuideRegister.getDepartment(),
                tourGuideRegister.getGrade(),
                tourGuideRegister.getIban(),
                0.0
        );

        TourGuide savedTourGuide = tourGuideService.saveTourGuide(tourGuide);

        // Send the password to the user's email
        String subject = "BTO Hesap Bilgileriniz";
        String text = String.format(
                "Merhaba %s %s,\n\nBTO sistemine giriş yapabilmeniz için şifreniz: %s\n\nLütfen şifrenizi en kısa sürede değiştiriniz.",
                tourGuideRegister.getFirstName(),
                tourGuideRegister.getLastName(),
                randomPassword
        );

        try {
            System.out.println(tourGuideRegister.getEmail());
            mailService.sendMail(tourGuideRegister.getEmail(), subject, text);
            return new ResponseEntity<>(savedTourGuide, HttpStatus.CREATED);
        } catch (Exception e) {
            // If email fails, still return a success response but log the issue
            e.printStackTrace();
            return ResponseEntity.status(201).body("Tour Guide created, but failed to send email.");
        }
    }

    /**
     * Retrieves all tour guides.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a list of all tour guides.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the list of all tour guides or error status.
     */
    @GetMapping("/tourguide/getAll")
    public ResponseEntity<?> getAllTourGuides() {
        try {
            // Fetch all tour guides from the service
            List<TourGuide> tourGuides = tourGuideService.getAllTourGuides();
            tourGuides.forEach(tourGuide -> {
                System.out.println("TourGuide: " + tourGuide.getEmail());
            });
            return ResponseEntity.ok(tourGuides); // Return the list of tour guides with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour guides.");
        }
    }

    /**
     * Deletes a tour guide by username.
     *
     * Preconditions:
     * - `username` must not be null and must correspond to an existing tour guide.
     *
     * Postconditions:
     * - The tour guide is deleted.
     * - If the tour guide does not exist, returns status 400 (BAD_REQUEST).
     * - If the tour guide has unfinished tours or pending payments, returns status 400 (BAD_REQUEST).
     *
     * @param username The username of the tour guide.
     * @return ResponseEntity containing the success message or error status.
     */
    @DeleteMapping("/tourguide/delete")
    public ResponseEntity<?> deleteTourGuide(@RequestParam String username) {
        if (tourGuideService.getTourGuideByEmail(username) == null) {
            return ResponseEntity.status(400).body("TourGuide With Username " + username + " Not Found");
        }
        if(tourGuideService.getTourGuideByEmail(username).getEnrolledTours() != null){
            for(Tour tour: tourGuideService.getTourGuideByEmail(username).getEnrolledTours()){
                if(tour.getTourStatus().equals("GuideAssigned") || tour.getTourStatus().equals("WithdrawRequested") || tour.getTourStatus().equals("Withdrawn") || tour.getTourStatus().equals("AdvisorAssigned")){
                    return ResponseEntity.status(400).body("Bu emaildeki " + username + " rehberin bitmemiş turları var!");
                }
            }
        }
        for(Payment payment: tourGuideService.getTourGuideByEmail(username).getPaymentHistory()){
            if(payment.getStatus().equals("PENDING") || payment.getStatus().equals("UPDATED")){
                return ResponseEntity.status(400).body("Bu emaildeki " + username + " rehberin bekleyen ödemesi var!");
            }
        }
        tourGuideService.deleteTourGuideByUsername(username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

// TourGuide Methods END
////////////////
// Advisor Methods START

    /**
     * Registers a new advisor.
     *
     * Preconditions:
     * - `advisorRegister` must not be null.
     * - `advisorRegister.email` must be unique.
     *
     * Postconditions:
     * - The advisor is registered and saved.
     * - If the email is already taken, returns status 400 (BAD_REQUEST).
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param advisorRegister The registration details of the advisor.
     * @return ResponseEntity containing the registered advisor or error status.
     */
    @PostMapping("/advisor/register")
    public ResponseEntity<?> registerAdvisor(@RequestBody AdvisorRegister advisorRegister) {
        if (userService.getUserByUsername(advisorRegister.getEmail()) != null) {
            return ResponseEntity.status(400).body("Username for advisor is already taken");
        }

        Advisor advisor = new Advisor(
                advisorRegister.getEmail(),
                advisorRegister.getPassword(),
                advisorRegister.getFirstName(),
                advisorRegister.getLastName(),
                advisorRegister.getPhoneNumber(),
                advisorRegister.getDepartment(),
                advisorRegister.getGrade(),
                advisorRegister.getIban(),
                advisorRegister.getAssignedDay()
        );

        return new ResponseEntity<>(advisorService.saveAdvisor(advisor), HttpStatus.CREATED);
    }

    /**
     * Retrieves all advisors.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a list of all advisors.
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @return ResponseEntity containing the list of all advisors or error status.
     */
    @GetMapping("/advisor/getAll")
    public ResponseEntity<?> getAllAdvisors() {
        try {
            // Fetch all tour guides from the service
            List<Advisor> advisors = advisorService.getAllAdvisors();
            return ResponseEntity.ok(advisors); // Return the list of tour guides with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour guides.");
        }
    }

    /**
     * Deletes an advisor by email.
     *
     * Preconditions:
     * - `email` must not be null and must correspond to an existing advisor.
     *
     * Postconditions:
     * - The advisor is deleted.
     * - If the advisor does not exist, returns status 400 (BAD_REQUEST).
     *
     * @param email The email of the advisor.
     * @return ResponseEntity containing the success message or error status.
     */
    @DeleteMapping("/advisor/delete")
    public ResponseEntity<?> deleteAdvisor(@RequestParam String email) {
        if (advisorService.getAdvisorByEmail(email) == null) {
            return ResponseEntity.status(400).body("Advisor With email " + email + " Not Found");
        }
        advisorService.deleteAdvisorByEmail(email);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Utility function to generate a random password
    private String generateRandomPassword(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";
        Random random = new SecureRandom();
        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            password.append(characters.charAt(random.nextInt(characters.length())));
        }
        return password.toString();
    }
// Advisor Methods END
////////////////

    /**
     * Promotes a tour guide to an advisor.
     *
     * Preconditions:
     * - `guideEmail` must not be null and must correspond to an existing tour guide.
     * - `assignedDay` must not be null.
     *
     * Postconditions:
     * - The tour guide is promoted to an advisor.
     * - If the tour guide does not exist, returns status 404 (NOT_FOUND).
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param guideEmail The email of the tour guide.
     * @param assignedDay The assigned day for the new advisor.
     * @return ResponseEntity containing the success message or error status.
     */
    @PostMapping("/promoteTourGuide")
    public ResponseEntity<?> promoteTourGuide(@RequestParam String guideEmail, @RequestParam String assignedDay){
        try {
            // Retrieve the Tour Guide by email
            TourGuide tourGuideToBePromoted = tourGuideService.getTourGuideByEmail(guideEmail);
            if (tourGuideToBePromoted==null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour Guide with email " + guideEmail + " not found.");
            }
            List<Tour> tours = tourGuideToBePromoted.getEnrolledTours();
            List<Payment> payments = tourGuideToBePromoted.getPaymentHistory();
            List<Fair> fairs = tourGuideToBePromoted.getEnrolledFairs();

            String randomPassword = generateRandomPassword(10);  // Password length is 10 characters
            tourGuideService.deleteTourGuideByUsername(tourGuideToBePromoted.getEmail());
            // Create new Advisor based on the TourGuide
            Advisor advisor = new Advisor(
                    tourGuideToBePromoted.getEmail(),
                    randomPassword,
                    tourGuideToBePromoted.getFirstName(),
                    tourGuideToBePromoted.getLastName(),
                    tourGuideToBePromoted.getPhoneNumber(),
                    tourGuideToBePromoted.getDepartment(),
                    tourGuideToBePromoted.getGrade(),
                    tourGuideToBePromoted.getIban(),
                    assignedDay
            );
            for (Tour tour : tours) {
                tour.setAssignedGuide(advisor);
            }
            for (Payment payment : payments) {
                payment.setTourGuide(advisor);
            }
            for (Fair fair : fairs) {
                fair.setAssignedGuideToFair(advisor);
            }

            // Save the newly created Advisor
            advisorService.saveAdvisor(advisor);

            // Send the password to the new Advisor's email
            String subject = "BTO Hesap Bilgileriniz";
            String text = String.format(
                    "Merhaba %s %s,\n\nDanışmanlığa yükseltildiniz. BTO sistemine giriş yapabilmeniz geçici için şifreniz: %s\n\nLütfen şifrenizi en kısa sürede değiştiriniz.",
                    advisor.getFirstName(),
                    advisor.getLastName(),
                    randomPassword
            );

            try {
                mailService.sendMail(advisor.getEmail(), subject, text);
                return ResponseEntity.ok("Tour Guide promoted to Advisor successfully.");
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(201).body("Tour Guide created, but failed to send email.");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while promoting the Tour Guide: " + e.getMessage());
        }
    }

}
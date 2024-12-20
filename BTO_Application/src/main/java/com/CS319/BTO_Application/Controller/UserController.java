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

    // Forgot Password: Send Reset Code to Email
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

    // Counselor Methods
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
    @PostMapping("/coordinator/register")
    public ResponseEntity<?> registerCoordinator(@RequestBody BTOMemberRegister btoMemberRegister) {
        if (userService.getUserByUsername(btoMemberRegister.getEmail()) != null) {
            return ResponseEntity.status(400).body("Username for coordinator is already taken");
        }

        Coordinator coordinator = new Coordinator(
                btoMemberRegister.getEmail(),
                btoMemberRegister.getPassword(),
                btoMemberRegister.getFirstName(),
                btoMemberRegister.getLastName(),
                btoMemberRegister.getPhoneNumber(),
                "Coordinator"
        );

        return new ResponseEntity<>(coordinatorService.saveCoordinator(coordinator), HttpStatus.CREATED);
    }
    @PostMapping("/executive/register")
    private ResponseEntity<?> registerExecutive(@RequestBody BTOMemberRegister btoMemberRegister) {
        // Check for unique username
        if (userService.getUserByUsername(btoMemberRegister.getEmail()) != null) {
            return ResponseEntity.status(400).body("Username for executive is already taken");
        }

        Executive executive = new Executive(
                btoMemberRegister.getEmail(),
                btoMemberRegister.getPassword(),
                btoMemberRegister.getFirstName(),
                btoMemberRegister.getLastName(),
                btoMemberRegister.getPhoneNumber(),
                "Executive"
        );

        // Save the Executive to the database
        return new ResponseEntity<>(executiveService.saveExecutive(executive), HttpStatus.CREATED);
    }
    @GetMapping("/coordinator/getAll")
    public ResponseEntity<?> getAllCoordinators() {
        try {
            // Fetch all tour guides from the service
            List<Coordinator> coordinators = coordinatorService.getAllCoordinators();
            coordinators.forEach(tourGuide -> {
                System.out.println("TourGuide: " + tourGuide.getEmail());
            });
            return ResponseEntity.ok(coordinators); // Return the list of tour guides with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour guides.");
        }
    }
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

    @DeleteMapping("/tourguide/delete")
    public ResponseEntity<?> deleteTourGuide(@RequestParam String username) {
        if (tourGuideService.getTourGuideByEmail(username) == null) {
            return ResponseEntity.status(400).body("TourGuide With Username " + username + " Not Found");
        }
        if(tourGuideService.getTourGuideByEmail(username).getEnrolledTours() != null){
            for(Tour tour: tourGuideService.getTourGuideByEmail(username).getEnrolledTours()){
                if(tour.getTourStatus().equals("GuideAssigned")){
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

            tourGuideService.deleteTourGuideByUsername(tourGuideToBePromoted.getEmail());
            // Create a new Advisor with Tour Guide's attributes
            Advisor advisor = new Advisor(
                    tourGuideToBePromoted.getEmail(),
                    tourGuideToBePromoted.getPassword(),
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
            advisorService.saveAdvisor(advisor);
            return ResponseEntity.ok("Tour Guide promoted to Advisor successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while promoting the Tour Guide: " + e.getMessage());
        }
    }
}
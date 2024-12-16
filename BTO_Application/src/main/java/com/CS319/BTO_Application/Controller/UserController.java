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

    @Autowired
    public UserController(UserService userService, CounselorService counselorService,
                          CoordinatorService coordinatorService, TourGuideService tourGuideService,
                          HighSchoolService highschoolService, AdvisorService advisorService, ExecutiveService executiveService) {
        this.userService = userService;
        this.counselorService = counselorService;
        this.coordinatorService = coordinatorService;
        this.tourGuideService = tourGuideService;
        this.highschoolService = highschoolService;
        this.advisorService = advisorService;
        this.executiveService = executiveService;
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
    private ResponseEntity<?> registerExecutive(BTOMemberRegister btoMemberRegister) {
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

        TourGuide tourGuide = new TourGuide(
                tourGuideRegister.getEmail(),
                tourGuideRegister.getPassword(),
                tourGuideRegister.getFirstName(),
                tourGuideRegister.getLastName(),
                tourGuideRegister.getPhoneNumber(),
                tourGuideRegister.getDepartment(),
                tourGuideRegister.getGrade(),
                tourGuideRegister.getIban()
        );

        return new ResponseEntity<>(tourGuideService.saveTourGuide(tourGuide), HttpStatus.CREATED);
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

// Advisor Methods END
////////////////
}
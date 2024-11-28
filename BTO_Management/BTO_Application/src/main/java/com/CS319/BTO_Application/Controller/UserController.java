package com.CS319.BTO_Application.Controller;
import com.CS319.BTO_Application.DTO.*;
import com.CS319.BTO_Application.Entity.Coordinator;
import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.HighSchool;
//import com.CS319.BTO_Application.Service.UserService;
import com.CS319.BTO_Application.Entity.TourGuide;
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

    @Autowired
    public UserController(UserService userService, CounselorService counselorService,
              CoordinatorService coordinatorService, TourGuideService tourGuideService,
              HighSchoolService highschoolService) {
        this.userService = userService;
        this.counselorService = counselorService;
        this.coordinatorService = coordinatorService;
        this.tourGuideService = tourGuideService;
        this.highschoolService = highschoolService;
    }

// Counselor Methods
    @GetMapping("/counselors/getAll")
    public ResponseEntity<?> getAllCounselors() {
        try {
            // Fetch all counselors from the service
            List<CounselorDTO> counselors = counselorService.getAllCounselors();
            counselors.forEach(counselor -> {
                System.out.println("Counselor: " + counselor.getUsername() + ", HighSchool: " + counselor.getHighSchool());
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
        if (counselorService.getCounselorByUsername(counselorRegister.getUsername()) != null) {
            return ResponseEntity.status(400).body("Username is already taken");
        }
        if(highschoolService.getSchoolByName(counselorRegister.getSchoolName()) == null){
            return ResponseEntity.status(400).body("Highschool does not exist");
        }
        HighSchool highSchool = highschoolService.getSchoolByName(counselorRegister.getSchoolName());
        Counselor counselor = new Counselor(counselorRegister.getUsername(), counselorRegister.getPassword(), counselorRegister.getRole(), highSchool);
        // Save the user to the database
        return new ResponseEntity<>(counselorService.saveCounselor(counselor), HttpStatus.CREATED);
    }

    @DeleteMapping("/counselor/delete")
    public ResponseEntity<?> deleteCounselor(@RequestParam String username) {
        counselorService.deleteCounselorByUsername(username);
        if (counselorService.getCounselorByUsername(username) == null) {
            return ResponseEntity.status(400).body("Counselor With Username "+username+"Not Found");
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get HighSchool by Counselor username
//    @GetMapping("/counselor/school")
//    public ResponseEntity<?> getHighSchoolByCounselor(@PathVariable String username) {
//        try {
//            HighSchool highSchool = counselorService.getHighSchoolByCounselor(username);
//            return ResponseEntity.ok(highSchool); // Return the HighSchool associated with the Counselor
//        } catch (IllegalArgumentException ex) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); // If no counselor found
//        } catch (Exception ex) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
//        }
//    }
// Counselor Methods END
////////////////////////////
// Coordinator Methods START
    @PostMapping("/coordinator/register")
    public ResponseEntity<?> registerCoordinator(@RequestBody CoordinatorRegister coordinatorRegister) {
        // Check if the username is already taken
        // Username is user's Bilkent ID

        if(coordinatorRegister.getRole() == "TourGuide") {
            if (tourGuideService.getTourGuideByUsername(coordinatorRegister.getUsername()) != null) {
                return ResponseEntity.status(400).body("Username for tour guide is already taken");
            }
            TourGuide tourGuide = new TourGuide(coordinatorRegister.getUsername(), coordinatorRegister.getPassword(), coordinatorRegister.getRole());
            System.out.println("Newly created " + tourGuide.getUsername());
            // Save the tour guide to the database
            return new ResponseEntity<>(tourGuideService.saveTourGuide(tourGuide), HttpStatus.CREATED);
        } else if (coordinatorRegister.getRole() == "Counselor") {
            if (coordinatorService.getCoordinatorByUsername(coordinatorRegister.getUsername()) != null) {
                return ResponseEntity.status(400).body("Username for counselor is already taken");
            }
            Coordinator coordinator = new Coordinator(coordinatorRegister.getUsername(), coordinatorRegister.getPassword(), coordinatorRegister.getRole());
            // Save the user to the database
            return new ResponseEntity<>(coordinatorService.saveCoordinator(coordinator), HttpStatus.CREATED);
        }
        else return null;
    }

    @DeleteMapping("/coordinator/delete")
    public ResponseEntity<?> deleteCoordinator(@RequestParam String username) {
        coordinatorService.deleteCoordinatorByUsername(username);
        if (coordinatorService.getCoordinatorByUsername(username) == null) {
            return ResponseEntity.status(400).body("Coordinator With Username "+username+"Not Found");
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
// Coordinator Methods END
////////////////////////
// TourGuide Methods START
    @GetMapping("/tourguides/getAll")
    public ResponseEntity<?> getAllTourGuides() {
        try {
            // Fetch all tour guides from the service
            List<TourGuide> tourGuides = tourGuideService.getAllTourGuides();
            tourGuides.forEach(tourGuide -> {
                System.out.println("TourGuide: " + tourGuide.getUsername());
            });
            return ResponseEntity.ok(tourGuides); // Return the list of tour guides with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour guides.");
        }
    }

    @PostMapping("/tourguide/register")
    public ResponseEntity<?> registerTourGuide(@RequestBody TourGuideRegister tourGuideRegister) {
        System.out.println("u s e r na me"+tourGuideRegister.getUsername());
        // Check if the username is already taken
        if (tourGuideService.getTourGuideByUsername(tourGuideRegister.getUsername()) != null) {
            return ResponseEntity.status(400).body("Username is already taken");
        }
        TourGuide tourGuide = new TourGuide(tourGuideRegister.getUsername(), tourGuideRegister.getPassword(), tourGuideRegister.getRole());
        System.out.println("Newly created "+tourGuide.getUsername());

        // Save the tour guide to the database
        return new ResponseEntity<>(tourGuideService.saveTourGuide(tourGuide), HttpStatus.CREATED);
    }

    @DeleteMapping("/tourguide/delete")
    public ResponseEntity<?> deleteTourGuide(@RequestParam String username) {
        tourGuideService.deleteTourGuideByUsername(username);
        if (tourGuideService.getTourGuideByUsername(username) == null) {
            return ResponseEntity.status(400).body("TourGuide With Username " + username + " Not Found");
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

// TourGuide Methods END
////////////////


    /*
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        // Check if the username is already taken
        if (userService.getUserByUsername(registerRequest.getUsername()) != null) {
            return ResponseEntity.status(400).body("Username is already taken");
        }
        // Create a new user with hashed password and specified role
        User user = new User(registerRequest.getUsername(), registerRequest.getPassword(), registerRequest.getRole());

        // Save the user to the database
        return new ResponseEntity<>(userService.saveUser(user), HttpStatus.CREATED);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<HttpStatus> deleteUser(@RequestParam String username) {
        userService.deleteUserByUsername(username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

     */
}





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
            List<Counselor> counselors = counselorService.getAllCounselors();
            counselors.forEach(counselor -> {
                System.out.println("Counselor: " + counselor.getUsername() + ", HighSchool: " + counselor.getHighSchool() );
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
        if (counselorService.getCounselorByUsername(username) == null) {
            return ResponseEntity.status(400).body("Counselor With Username "+username+"Not Found");
        }
        counselorService.deleteCounselorByUsername(username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

// Counselor Methods END
////////////////////////////
// BTO Member Methods START
    @PostMapping("/BTOMember/register")
    public ResponseEntity<?> registerBTOMember(@RequestBody BTOMemberRegister btoMemberRegister) {
        // Username is user's Bilkent ID
        if(btoMemberRegister.getRole().equals("TourGuide")) {
            // check for unique username
            if (tourGuideService.getTourGuideByUsername(btoMemberRegister.getUsername()) != null) {
                return ResponseEntity.status(400).body("Username for tour guide is already taken");
            }
            TourGuide tourGuide = new TourGuide(btoMemberRegister.getUsername(), btoMemberRegister.getPassword(), btoMemberRegister.getRole());

            // Save the tour guide to the database
            return new ResponseEntity<>(tourGuideService.saveTourGuide(tourGuide), HttpStatus.CREATED);

        } else if (btoMemberRegister.getRole().equals("Coordinator")) {
            // check for unique username
            if (coordinatorService.getCoordinatorByUsername(btoMemberRegister.getUsername()) != null) {
                return ResponseEntity.status(400).body("Username for coordinator is already taken");
            }
            Coordinator coordinator = new Coordinator(btoMemberRegister.getUsername(), btoMemberRegister.getPassword(), btoMemberRegister.getRole());

            // Save the Coordinator to the database
            return new ResponseEntity<>(coordinatorService.saveCoordinator(coordinator), HttpStatus.CREATED);

        } // executive will be added
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid role specified. Accepted roles are: TourGuide, Coordinator");
        }

    }
// BTO Member Methods END
////////////////////////////
// Coordinator Methods START
    @GetMapping("/coordinator/getAll")
    public ResponseEntity<?> getAllCoordinators() {
        try {
            // Fetch all tour guides from the service
            List<Coordinator> coordinators = coordinatorService.getAllCoordinators();
            coordinators.forEach(tourGuide -> {
                System.out.println("TourGuide: " + tourGuide.getUsername());
            });
            return ResponseEntity.ok(coordinators); // Return the list of tour guides with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour guides.");
        }
    }
    @DeleteMapping("/coordinator/delete")
    public ResponseEntity<?> deleteCoordinator(@RequestParam String username) {
        if (coordinatorService.getCoordinatorByUsername(username) == null) {
            return ResponseEntity.status(400).body("Coordinator With Username "+username+"Not Found");
        }
        coordinatorService.deleteCoordinatorByUsername(username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
// Coordinator Methods END
////////////////////////
// TourGuide Methods START
    @GetMapping("/tourguide/getAll")
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

    @DeleteMapping("/tourguide/delete")
    public ResponseEntity<?> deleteTourGuide(@RequestParam String username) {
        if (tourGuideService.getTourGuideByUsername(username) == null) {
            return ResponseEntity.status(400).body("TourGuide With Username " + username + " Not Found");
        }
        tourGuideService.deleteTourGuideByUsername(username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


// TourGuide Methods END
////////////////
}





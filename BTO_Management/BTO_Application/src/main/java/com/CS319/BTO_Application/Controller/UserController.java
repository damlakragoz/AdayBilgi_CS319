package com.CS319.BTO_Application.Controller;
import com.CS319.BTO_Application.DTO.CoordinatorRegister;
import com.CS319.BTO_Application.DTO.CounselorRegister;
import com.CS319.BTO_Application.DTO.LoginRequest;
import com.CS319.BTO_Application.DTO.RegisterRequest;
import com.CS319.BTO_Application.Entity.Coordinator;
import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.HighSchool;
import com.CS319.BTO_Application.Entity.User;
import com.CS319.BTO_Application.Repos.CoordinatorRepos;
import com.CS319.BTO_Application.Repos.UserRepos;
//import com.CS319.BTO_Application.Service.UserService;
import com.CS319.BTO_Application.Service.CoordinatorService;
import com.CS319.BTO_Application.Service.CounselorService;
import com.CS319.BTO_Application.Service.HighSchoolService;
import com.CS319.BTO_Application.Service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final CounselorService counselorService;
    private final CoordinatorService coordinatorService;
    private final HighSchoolService highschoolService;



    @Autowired
    public UserController(UserService userService, CounselorService counselorService, CoordinatorService coordinatorService, HighSchoolService highschoolService) {
        this.userService = userService;
        this.counselorService = counselorService;
        this.coordinatorService = coordinatorService;
        this.highschoolService = highschoolService;
    }

// Counselor Methods
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
// Counselor Methods END
////////////////////////
//Coordinator Method
    @PostMapping("/coordinator/register")
    public ResponseEntity<?> registerCoordinator(@RequestBody CoordinatorRegister coordinatorRegister) {
        // Check if the username is already taken
        // Username is user's Bilkent ID
        if (coordinatorService.getCoordinatorByUsername(coordinatorRegister.getUsername()) != null) {
            return ResponseEntity.status(400).body("Username is already taken");
        }
        Coordinator coordinator = new Coordinator(coordinatorRegister.getUsername(), coordinatorRegister.getPassword(), coordinatorRegister.getRole());
        // Save the user to the database
        return new ResponseEntity<>(coordinatorService.saveCoordinator(coordinator), HttpStatus.CREATED);
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





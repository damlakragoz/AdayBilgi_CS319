package com.CS319.BTO_Application.Controller;
import com.CS319.BTO_Application.DTO.CounselorRegister;
import com.CS319.BTO_Application.DTO.LoginRequest;
import com.CS319.BTO_Application.DTO.RegisterRequest;
import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.HighSchool;
import com.CS319.BTO_Application.Entity.User;
import com.CS319.BTO_Application.Repos.UserRepos;
//import com.CS319.BTO_Application.Service.UserService;
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
@RequestMapping("/api/counselor")
public class CounselorController {

    private final UserService userService;
    private final HighSchoolService highschoolService;

    @Autowired
    public CounselorController(UserService userService, HighSchoolService highschoolService) {
        this.userService = userService;
        this.highschoolService = highschoolService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCounselor(@RequestBody CounselorRegister counselorRegister) {
        // Check if the username is already taken
        if (userService.getUserByUsername(counselorRegister.getUsername()) != null) {
            return ResponseEntity.status(400).body("Username is already taken");
        }
        if(highschoolService.getSchoolByName(counselorRegister.getSchoolName()) == null){
            return ResponseEntity.status(400).body("Highschool does not exist");
        }
        HighSchool highSchool = highschoolService.getSchoolByName(counselorRegister.getSchoolName());
        Counselor counselor = new Counselor(counselorRegister.getUsername(), counselorRegister.getPassword(), counselorRegister.getRole(), highSchool);
        // Save the user to the database
        return new ResponseEntity<>(userService.saveUser(counselor), HttpStatus.CREATED);
    }

}





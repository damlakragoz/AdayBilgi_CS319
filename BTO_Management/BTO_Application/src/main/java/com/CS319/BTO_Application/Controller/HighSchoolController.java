package com.CS319.BTO_Application.Controller;


import com.CS319.BTO_Application.DTO.HighSchoolRegister;
import com.CS319.BTO_Application.DTO.RegisterRequest;
import com.CS319.BTO_Application.Entity.HighSchool;
import com.CS319.BTO_Application.Entity.User;
import com.CS319.BTO_Application.Service.HighSchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/school")
public class HighSchoolController {
    private final HighSchoolService highschoolService;

    @Autowired
    public HighSchoolController(HighSchoolService highschoolService) {
        this.highschoolService = highschoolService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerHighSchool(@RequestBody HighSchoolRegister highSchoolRegister) {
        // Check if the username is already taken
        if (highschoolService.getSchoolByName(highSchoolRegister.getSchoolName()) != null) {
            return ResponseEntity.status(400).body("Highschool already exists");
        }

        HighSchool highSchool = new HighSchool(highSchoolRegister.getSchoolName());
        // Save the highschool to the database
        return new ResponseEntity<>(highschoolService.saveHighSchool(highSchool),HttpStatus.CREATED);
    }
}

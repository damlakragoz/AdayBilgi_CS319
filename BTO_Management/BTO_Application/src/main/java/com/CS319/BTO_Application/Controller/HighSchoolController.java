package com.CS319.BTO_Application.Controller;


import com.CS319.BTO_Application.DTO.HighSchoolRegister;
import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.HighSchool;
import com.CS319.BTO_Application.Service.HighSchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

        HighSchool highSchool = new HighSchool(highSchoolRegister.getSchoolName(), highSchoolRegister.getCity());
        // Save the highschool to the database
        return new ResponseEntity<>(highschoolService.saveHighSchool(highSchool),HttpStatus.CREATED);
    }

    @GetMapping("/getCounselors")
    public ResponseEntity<?> getCounselors(@RequestParam String schoolName) {
        try {
            // Call the service method to get the counselors
            List<Counselor> counselors = highschoolService.getAllCounselors(schoolName);
            // Return the counselors with a 200 OK status
            return ResponseEntity.ok(counselors);
        } catch (IllegalArgumentException ex) {
            // Return an error response if no counselors are found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            // Handle any unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }
}

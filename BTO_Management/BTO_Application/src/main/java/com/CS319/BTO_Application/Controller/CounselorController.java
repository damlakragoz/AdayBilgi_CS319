package com.CS319.BTO_Application.Controller;
import com.CS319.BTO_Application.DTO.CounselorRegister;
import com.CS319.BTO_Application.DTO.LoginRequest;
import com.CS319.BTO_Application.DTO.RegisterRequest;
import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.HighSchool;
import com.CS319.BTO_Application.Entity.User;
import com.CS319.BTO_Application.Repos.UserRepos;
//import com.CS319.BTO_Application.Service.UserService;
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
@RequestMapping("/api/counselor")
public class CounselorController {

    private final CounselorService counselorService;
    private final HighSchoolService highschoolService;

    @Autowired
    public CounselorController(CounselorService counselorService, HighSchoolService highschoolService) {
        this.counselorService = counselorService;
        this.highschoolService = highschoolService;
    }
}





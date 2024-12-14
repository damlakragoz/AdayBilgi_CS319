package com.CS319.BTO_Application.Controller;
import com.CS319.BTO_Application.DTO.LoginRequest;
import com.CS319.BTO_Application.Service.AuthService;
import com.CS319.BTO_Application.jwt.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")

public class UserAuthController {
    private final AuthService authService;


    @Autowired
    public UserAuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        System.out.println(loginRequest.getUsername() + " " + loginRequest.getPassword());
        try {
            String token = authService.authenticateUser(loginRequest);
            // Return the token in a JSON format
            Map<String, String> response = new HashMap<>();
            response.put("token", token);

            return ResponseEntity.ok(response); // Respond with {"token": "<JWT Token>"}
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/user-role")
    public String getUserRole(@RequestBody LoginRequest loginRequest) {
        return authService.getUserRole(loginRequest);
    }


}

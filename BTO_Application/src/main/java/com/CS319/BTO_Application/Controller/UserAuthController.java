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
public class UserAuthController {
    private final AuthService authService;


    @Autowired
    public UserAuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Authenticates a user and generates a JWT token.
     *
     * Preconditions:
     * - `loginRequest` must not be null.
     * - `loginRequest.username` and `loginRequest.password` must not be null.
     *
     * Postconditions:
     * - If authentication is successful, returns a JWT token with status 200 (OK).
     * - If authentication fails, returns status 401 (UNAUTHORIZED).
     *
     * @param loginRequest The login request containing username and password.
     * @return ResponseEntity containing the JWT token or error status.
     */
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

    /**
     * Retrieves the role of a user.
     *
     * Preconditions:
     * - `loginRequest` must not be null.
     * - `loginRequest.username` and `loginRequest.password` must not be null.
     *
     * Postconditions:
     * - Returns the role of the user as a string.
     *
     * @param loginRequest The login request containing username and password.
     * @return The role of the user.
     */
    @PostMapping("/user-role")
    public String getUserRole(@RequestBody LoginRequest loginRequest) {
        return authService.getUserRole(loginRequest);
    }


}

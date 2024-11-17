package com.CS319.BTO_Application.Controller;
import com.CS319.BTO_Application.DTO.LoginRequest;
import com.CS319.BTO_Application.DTO.RegisterRequest;
import com.CS319.BTO_Application.Entity.User;
import com.CS319.BTO_Application.Repos.UserRepos;
//import com.CS319.BTO_Application.Service.UserService;
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
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

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
}





package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.DTO.LoginRequest;
import com.CS319.BTO_Application.Entity.User;
import com.CS319.BTO_Application.jwt.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Collections;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserService userService;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, JwtTokenUtil jwtTokenUtil, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userService = userService;
    }

    public String authenticateUser(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // If authentication is successful, set the authentication in the context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate and return the token
            return jwtTokenUtil.generateToken(loginRequest.getUsername());

        } catch (AuthenticationException e) {
            // Log the authentication failure (optional)
            System.out.println("Authentication failed: " + e.getMessage());
            // Return null or throw a custom exception to indicate failed authentication
            return null;
        }
    }

//    @GetMapping("/user/role")
//    public String getUserRole(LoginRequest loginRequest) {
//        // Extract the user information from the token and fetch the role from the database
//        String username = loginRequest.getUsername();  // Extract username from token
//        User user = userService.getUserByUsername(username);  // Fetch the user from the database
//
//        if (user != null) {
//            return user.getRole() ;  // Return the role
//        }
//        else return null;
//    }

}

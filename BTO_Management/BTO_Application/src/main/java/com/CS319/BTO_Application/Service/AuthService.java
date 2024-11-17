package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.DTO.LoginRequest;
import com.CS319.BTO_Application.jwt.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, JwtTokenUtil jwtTokenUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
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
}

package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.DTO.LoginRequest;
import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.User;
import com.CS319.BTO_Application.Repos.CounselorRepos;
import com.CS319.BTO_Application.Repos.UserRepos;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    private final UserRepos<User> userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private Map<String, String> resetCodeStore = new HashMap<>(); // Temporary storage for reset codes


    @Autowired
    public UserService(UserRepos<User> userRepository, PasswordEncoder passwordEncoder, MailService mailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }

    public User getUserByUsername(String username) {
        return userRepository.findByEmail(username);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    public void updatePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Step 1: Generate Reset Code and Send Email
    public void sendResetCode(String email) {
        if (getUserByUsername(email) == null) {
            System.out.println("User with this email does not exist.");
        }

        while (!resetCodeStore.isEmpty() && resetCodeStore.get(email) != null) {
            resetCodeStore.remove(email);
        }
         String code = generateRandomCode();
        resetCodeStore.put(email, code);

        String subject = "Şifre Sıfırlama Kodu";
        String text = "Şifre sıfırlama kodunuz: " + code;

        mailService.sendMail(email, subject, text);
    }

    // Step 2: Verify Code
    public boolean verifyResetCode(String email, String code) {
        return resetCodeStore.containsKey(email) && resetCodeStore.get(email).equals(code);
    }

    // Step 3: Reset Password
    public void resetPassword(String email, String newPassword, String code) {
        if (!verifyResetCode(email, code)) {
            System.out.println("Invalid code or email.");
        }

        User user = getUserByUsername(email);
        updatePassword(user, newPassword); // Hash password here in production
        resetCodeStore.remove(email); // Clean up
    }

    // Utility to Generate Random 6-Digit Code
    private String generateRandomCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }

}


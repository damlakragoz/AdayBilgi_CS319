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

    /**
     * Loads a user by their username (email).
     *
     * @param username The email of the user.
     * @return UserDetails object for the user.
     * @throws UsernameNotFoundException If no user with the specified email exists.
     */
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

    /**
     * Retrieves a user by their email.
     *
     * @param username The email of the user.
     * @return The `User` entity, or `null` if not found.
     */
    public User getUserByUsername(String username) {
        return userRepository.findByEmail(username);
    }

    /**
     * Retrieves a list of all users in the system.
     *
     * @return List of all `User` entities.
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Checks if a raw password matches the encoded password of the user.
     *
     * @param user The `User` entity whose password is to be verified.
     * @param rawPassword The raw password input.
     * @return `true` if the passwords match, `false` otherwise.
     */
    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    /**
     * Updates the password for a user.
     *
     * @param user The `User` entity whose password is to be updated.
     * @param newPassword The new password to set (will be encoded).
     */
    public void updatePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Sends a password reset code to the user's email.
     *
     * Preconditions:
     * - The email must belong to a registered user.
     *
     * Postconditions:
     * - A reset code is generated and stored temporarily.
     * - An email containing the reset code is sent to the user.
     *
     * @param email The email to which the reset code will be sent.
     */
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

    /**
     * Verifies if a provided reset code matches the stored reset code for a user.
     *
     * @param email The email of the user.
     * @param code The reset code to verify.
     * @return `true` if the code is valid, `false` otherwise.
     */
    public boolean verifyResetCode(String email, String code) {
        return resetCodeStore.containsKey(email) && resetCodeStore.get(email).equals(code);
    }

    /**
     * Resets the password for a user if the provided reset code is valid.
     *
     * Preconditions:
     * - The provided reset code must match the stored reset code.
     *
     * Postconditions:
     * - The user's password is updated to the new password.
     * - The reset code is removed from storage.
     *
     * @param email The email of the user.
     * @param newPassword The new password to set.
     * @param code The reset code provided by the user.
     */
    public void resetPassword(String email, String newPassword, String code) {
        if (!verifyResetCode(email, code)) {
            System.out.println("Invalid code or email.");
        }

        User user = getUserByUsername(email);
        updatePassword(user, newPassword); // Hash password here in production
        resetCodeStore.remove(email); // Clean up
    }

    /**
     * Generates a random 6-digit reset code.
     *
     * @return A randomly generated 6-digit code as a string.
     */
    private String generateRandomCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }

    /**
     * Saves a `User` entity to the database.
     *
     * @param user The `User` entity to save.
     */
    public void saveUser(User user) {
        userRepository.save(user);
    }

}


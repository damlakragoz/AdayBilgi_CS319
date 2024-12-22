package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Executive;
import com.CS319.BTO_Application.Repos.ExecutiveRepos;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class ExecutiveService {
    private final ExecutiveRepos executiveRepos;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public ExecutiveService(ExecutiveRepos executiveRepos, PasswordEncoder passwordEncoder) {
        this.executiveRepos = executiveRepos;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Retrieves all executives from the database.
     *
     * @return List of all executives.
     */
    public List<Executive> getAllExecutives() {
        return executiveRepos.findAll();
    }

    /**
     * Retrieves an executive by their email.
     *
     * Preconditions:
     * - The email must exist in the database.
     *
     * @param email The email of the executive.
     * @return The executive if found, otherwise null.
     */
    public Executive getExecutiveByEmail(String email) {
        if (!executiveRepos.existsByEmail(email)) {
            System.out.println("Executive with email" + email + "does not exist");
            return null;
        }
        return executiveRepos.findByEmail(email);
    }

    /**
     * Saves a new executive to the database with an encoded password.
     *
     * Preconditions:
     * - The executive must have valid email and password fields.
     *
     * Postconditions:
     * - The executive is persisted in the database with their password securely encoded.
     *
     * @param executive The executive to save.
     * @return The saved executive.
     */
    public Executive saveExecutive(Executive executive) {
        executive.setPassword(passwordEncoder.encode(executive.getPassword()));
        return executiveRepos.save(executive);
    }

    /**
     * Deletes an executive by their username (email).
     *
     * Preconditions:
     * - The username (email) must exist in the database.
     *
     * Postconditions:
     * - The executive is removed from the database.
     *
     * @param username The username (email) of the executive to delete.
     * @throws UsernameNotFoundException If the executive does not exist.
     */
    @Transactional
    public void deleteExecutiveByUsername(String username) {
        Executive executive = executiveRepos.findByEmail(username);
        if (executive == null) {
            throw new UsernameNotFoundException("Executive with email " + username + " does not exist");
        }
        executiveRepos.delete(executive);
    }
}

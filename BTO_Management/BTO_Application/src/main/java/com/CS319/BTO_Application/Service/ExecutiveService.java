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

    public List<Executive> getAllExecutives() {
        return executiveRepos.findAll();
    }

    public Executive getExecutiveByEmail(String email) {
        if (!executiveRepos.existsByEmail(email)) {
            System.out.println("Executive with email" + email + "does not exist");
            return null;
        }
        return executiveRepos.findByEmail(email);
    }

    public Executive saveExecutive(Executive executive) {
        executive.setPassword(passwordEncoder.encode(executive.getPassword()));
        return executiveRepos.save(executive);
    }

    @Transactional
    public void deleteExecutiveByUsername(String username) {
        Executive executive = executiveRepos.findByEmail(username);
        if (executive == null) {
            throw new UsernameNotFoundException("Executive with email " + username + " does not exist");
        }
        executiveRepos.delete(executive);
    }
}

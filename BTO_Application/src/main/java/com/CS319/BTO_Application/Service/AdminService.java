package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Repos.AdminRepos;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    private final AdminRepos adminRepos;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(AdminRepos adminRepos, PasswordEncoder passwordEncoder) {
        this.adminRepos = adminRepos;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Saves or updates a `Admin` entity in the database.
     *
     * @param admin The `Admin` entity to save.
     * @return The saved `Admin` entity.
     */
    public Admin saveAdmin(Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword())); //setPassword is new for this one
        return adminRepos.save(admin);
    }
}
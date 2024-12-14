package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.TourGuide;
import com.CS319.BTO_Application.Repos.TourGuideRepos;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TourGuideService {

    private final TourGuideRepos tourGuideRepos;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public TourGuideService(TourGuideRepos tourGuideRepos, PasswordEncoder passwordEncoder) {
        this.tourGuideRepos = tourGuideRepos;
        this.passwordEncoder = passwordEncoder;
    }

    // Get tour guide by email
    public TourGuide getTourGuideByEmail(String email) {
        if (!tourGuideRepos.existsByEmail(email)) {
            System.out.println("TourGuide Not Found with username " + email);
            return null;
        }
        return tourGuideRepos.findByEmail(email);
    }

    // Get all tour guides
    public List<TourGuide> getAllTourGuides() {
        return tourGuideRepos.findAllTourGuides();
    }

    // Save tour guide (with password encoding)
    public TourGuide saveTourGuide(TourGuide tourGuide) {
        tourGuide.setPassword(passwordEncoder.encode(tourGuide.getPassword())); // Encrypt password before saving
        return tourGuideRepos.save(tourGuide);
    }

    // Delete tour guide by username
    @Transactional
    public void deleteTourGuideByUsername(String email) {
        TourGuide tourGuide = tourGuideRepos.findByEmail(email);
        if (tourGuide == null) {
            throw new UsernameNotFoundException("Tour Guide not found: " + email);
        }
        tourGuideRepos.delete(tourGuide);
    }

    // Update work hours for a tour guide
    @Transactional
    public TourGuide updateWorkHours(String email, float hoursWorked) {
        // Find the tour guide by email
        TourGuide tourGuide = tourGuideRepos.findByEmail(email);
        if (tourGuide == null) {
            throw new UsernameNotFoundException("Tour Guide not found: " + email);
        }

        // Update the work hours by adding the new hours
        float updatedWorkHours = tourGuide.getWorkHours() + hoursWorked;
        tourGuide.setWorkHours(updatedWorkHours);

        // Save the updated tour guide
        return tourGuideRepos.save(tourGuide);
    }
}

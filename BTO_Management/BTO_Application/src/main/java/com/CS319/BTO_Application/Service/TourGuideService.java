package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Repos.SchoolTourApplicationRepos;
import com.CS319.BTO_Application.Repos.TourGuideRepos;
import com.CS319.BTO_Application.Repos.UserRepos;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourGuideService {
    private final TourGuideRepos tourGuideRepos;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public TourGuideService(TourGuideRepos tourGuideRepos, PasswordEncoder passwordEncoder) {
        this.tourGuideRepos = tourGuideRepos;
        this.passwordEncoder = passwordEncoder;
    }

    public TourGuide getTourGuideByUsername(String username) {
        if (!tourGuideRepos.existsByUsername(username)) {
            System.out.println("TourGuide Not Found with username " + username);
            return null;
        }
        return tourGuideRepos.findByUsername(username);
    }

    public List<TourGuide> getAllTourGuides() {
        return tourGuideRepos.findAllTourGuides();
    }

    public TourGuide saveTourGuide(TourGuide tourGuide) {
        tourGuide.setPassword(passwordEncoder.encode(tourGuide.getPassword())); //setPassword is new for this one
        return tourGuideRepos.save(tourGuide);
    }

    @Transactional
    public void deleteTourGuideByUsername(String username) {
        TourGuide tourGuide = tourGuideRepos.findByUsername(username);
        if (tourGuide == null) {
            throw new UsernameNotFoundException("Tour Guide not found: " + username);
        }
        tourGuideRepos.delete(tourGuide);
    }
}

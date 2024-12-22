package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Repos.TourGuideRepos;
import jakarta.persistence.EntityNotFoundException;
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

    /**
     * Retrieves a `TourGuide` entity by their email.
     *
     * @param email Email of the tour guide to retrieve.
     * @return The `TourGuide` entity if found, or `null` if not found.
     */
    public TourGuide getTourGuideByEmail(String email) {
        if (!tourGuideRepos.existsByEmail(email)) {
            System.out.println("TourGuide Not Found with username " + email);
            return null;
        }
        return tourGuideRepos.findByEmail(email);
    }

    /**
     * Retrieves a list of all `TourGuide` entities.
     *
     * @return List of all `TourGuide` entities in the system.
     */
    public List<TourGuide> getAllTourGuides() {
        return tourGuideRepos.findAllTourGuides();
    }

    /**
     * Retrieves the list of tours assigned to a tour guide by their email.
     *
     * @param email Email of the tour guide.
     * @return List of `Tour` entities assigned to the specified tour guide, or `null` if the guide does not exist.
     */
    public List<Tour> getAssignedTours(String email) {
        if (!tourGuideRepos.existsByEmail(email)) {
            System.out.println("TourGuide Not Found with username " + email);
            return null;
        }
        return tourGuideRepos.findByEmail(email).getEnrolledTours();
    }

    /**
     * Retrieves the list of fairs assigned to a tour guide by their email.
     *
     * @param guideEmail Email of the tour guide.
     * @return List of `Fair` entities assigned to the specified tour guide, or `null` if the guide does not exist.
     */
    public List<Fair> getAssignedFairs(String guideEmail) {
        if (!tourGuideRepos.existsByEmail(guideEmail)) {
            System.out.println("TourGuide Not Found with username " + guideEmail);
            return null;
        }
        return tourGuideRepos.findByEmail(guideEmail).getEnrolledFairs();
    }

    /**
     * Saves or updates a `TourGuide` entity in the database.
     *
     * @param tourGuide The `TourGuide` entity to save.
     * @return The saved `TourGuide` entity.
     */
    public TourGuide saveTourGuide(TourGuide tourGuide) {
        tourGuide.setPassword(passwordEncoder.encode(tourGuide.getPassword())); //setPassword is new for this one
        return tourGuideRepos.save(tourGuide);
    }



    /**
     * Deletes a tour guide by their email and removes references in related entities.
     *
     * Preconditions:
     * - The tour guide must exist in the system.
     *
     * Postconditions:
     * - All references to the tour guide in `Payment`, `Tour`, and `Fair` entities are set to null.
     * - The `TourGuide` entity is deleted from the database.
     *
     * @param email Email of the tour guide to delete.
     */
    @Transactional
    public void deleteTourGuideByUsername(String email) {
        TourGuide tourGuide = tourGuideRepos.findByEmail(email);
        if (tourGuide == null) {
            throw new UsernameNotFoundException("Tour Guide not found: " + email);
        }

        // Set related Payments and Tours' references to null
        for (Payment payment : tourGuide.getPaymentHistory()) {
            payment.setTourGuide(null);
        }

        for (Tour tour : tourGuide.getEnrolledTours()) {
            tour.setAssignedGuide(null);
        }

        for (Fair fair : tourGuide.getEnrolledFairs()) {
            fair.setAssignedGuideToFair(null);
        }

        tourGuideRepos.delete(tourGuide);
    }


    /**
     * Retrieves a `TourGuide` entity by their ID.
     *
     * @param tourGuideId ID of the tour guide to retrieve.
     * @return The `TourGuide` entity if found.
     * @throws EntityNotFoundException If no `TourGuide` is found with the specified ID.
     */
    public TourGuide getTourGuideById(Long tourGuideId) {
        return tourGuideRepos.findById(tourGuideId)
                .orElseThrow(() -> new EntityNotFoundException("Tour Guide not found with ID: " + tourGuideId));
    }
}
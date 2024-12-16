package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Feedback;
import com.CS319.BTO_Application.Entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeedbackRepos extends JpaRepository<Feedback, Long> {
    boolean existsByTour(Tour tour);
    Optional<Feedback> findByTourId(Long tourId);
}

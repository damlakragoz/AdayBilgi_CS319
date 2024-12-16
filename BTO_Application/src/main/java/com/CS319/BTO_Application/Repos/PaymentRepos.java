package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepos extends JpaRepository<Payment, Long> {
    List<Payment> findByTourGuideId(Long tourGuideId);
    Payment findByTourId(Long tourId);
}

package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepos extends JpaRepository<Payment, Long> {
    List<Payment> findByTourGuideId(Long tourGuideId);
    @Query("SELECT p FROM Payment p WHERE p.status IN (:statuses)")
    List<Payment> findAllByStatuses(@Param("statuses") List<String> statuses);

    Payment findByTourId(Long tourId);

}

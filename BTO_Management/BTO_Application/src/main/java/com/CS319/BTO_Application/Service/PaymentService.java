package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Payment;
import com.CS319.BTO_Application.Entity.Tour;
import com.CS319.BTO_Application.Entity.TourGuide;
import com.CS319.BTO_Application.Repos.PaymentRepos;
import com.CS319.BTO_Application.Repos.SchoolTourRepos;
import com.CS319.BTO_Application.Repos.TourGuideRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PaymentService {

    private static final double HOURLY_RATE = 100.0; // Fixed hourly rate for calculation

    private final PaymentRepos paymentRepos;
    private final SchoolTourRepos schoolTourRepos;
    private final TourGuideRepos tourGuideRepos;

    @Autowired
    public PaymentService(PaymentRepos paymentRepos, SchoolTourRepos schoolTourRepos, TourGuideRepos tourGuideRepos) {
        this.paymentRepos = paymentRepos;
        this.schoolTourRepos = schoolTourRepos;
        this.tourGuideRepos = tourGuideRepos;
    }

    public Payment calculateAndCreatePayment(Long tourId, String tourGuideEmail) {
        // Validate tour
        Tour tour = schoolTourRepos.findById(tourId)
                .orElseThrow(() -> new IllegalArgumentException("Tour not found with ID: " + tourId));

        // Validate tour guide
        TourGuide tourGuide = tourGuideRepos.findByEmail(tourGuideEmail);
        if (tourGuide == null) {
            throw new IllegalArgumentException("Tour Guide not found with email: " + tourGuideEmail);
        }

        // Ensure the tour guide matches the assigned guide
        if (!tour.getAssignedGuideEmail().equals(tourGuide.getEmail())) {
            throw new IllegalArgumentException("The provided Tour Guide is not assigned to this tour.");
        }

        // Check if the tour status is "FINISHED"
        if (!tour.getTourStatus().equals("Finished")) {
            throw new IllegalArgumentException("Payment can only be created for tours with status 'FINISHED'.");
        }

        // Check for existing payment for the tour
        Payment existingPayment = paymentRepos.findByTourId(tourId);

        if (existingPayment != null) {
            // Update the existing payment
            existingPayment.setAmount(tour.getDuration() * HOURLY_RATE);
            existingPayment.setPaymentDate(new Date()); // Update payment date
            existingPayment.setStatus("UPDATED");
            return paymentRepos.save(existingPayment);
        } else {
            double amount = tour.getDuration() * HOURLY_RATE;

            Payment newPayment = new Payment();
            newPayment.setTourGuide(tourGuide);
            newPayment.setAmount(amount);
            newPayment.setPaymentDate(new Date());
            newPayment.setStatus("PENDING");
            newPayment.setTourId(tourId);

            return paymentRepos.save(newPayment);
        }
    }

    public List<Payment> getPaymentHistoryByGuide(String tourGuideEmail) {
        // Validate tour guide
        TourGuide tourGuide = tourGuideRepos.findByEmail(tourGuideEmail);
        if (tourGuide == null) {
            throw new IllegalArgumentException("Tour Guide not found with email: " + tourGuideEmail);
        }

        return paymentRepos.findByTourGuideId(tourGuide.getId());
    }
}

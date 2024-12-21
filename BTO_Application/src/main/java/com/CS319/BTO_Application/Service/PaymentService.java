package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Fair;
import com.CS319.BTO_Application.Entity.Payment;
import com.CS319.BTO_Application.Entity.Tour;
import com.CS319.BTO_Application.Entity.TourGuide;
import com.CS319.BTO_Application.Repos.FairRepos;
import com.CS319.BTO_Application.Repos.PaymentRepos;
import com.CS319.BTO_Application.Repos.SchoolTourRepos;
import com.CS319.BTO_Application.Repos.TourGuideRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Service
public class PaymentService {

    private static final double HOURLY_RATE_TOUR = 100.0; // Fixed hourly rate for calculation for tours
    private static final double HOURLY_RATE_FAIR = 75.0; // Fixed hourly rate for calculation for fairs

    private final PaymentRepos paymentRepos;
    private final SchoolTourRepos schoolTourRepos;
    private final TourGuideRepos tourGuideRepos;
    private final FairRepos fairRepos;

    @Autowired
    public PaymentService(PaymentRepos paymentRepos, SchoolTourRepos schoolTourRepos, TourGuideRepos tourGuideRepos, FairRepos fairRepos) {
        this.paymentRepos = paymentRepos;
        this.schoolTourRepos = schoolTourRepos;
        this.tourGuideRepos = tourGuideRepos;
        this.fairRepos = fairRepos;
    }

    public Payment calculateAndCreatePaymentForTour(Long tourId, String tourGuideEmail) {
        // Validate tour
        Tour tour = schoolTourRepos.findById(tourId)
                .orElseThrow(() -> new IllegalArgumentException("Tour not found with ID: " + tourId));
        System.out.println(tour.getAssignedGuideEmail());

        // Validate tour guide
        TourGuide tourGuide = tourGuideRepos.findByEmail(tourGuideEmail);
        if (tourGuide == null) {
            System.out.println("Tour guide found with ID: " + tourGuideEmail);
            throw new IllegalArgumentException("Tour Guide not found with email: " + tourGuideEmail);
        }

        // Ensure the tour guide matches the assigned guide
        if (!tour.getAssignedGuideEmail().equals(tourGuide.getEmail())) {
            System.out.println("The provided Tour Guide is not assigned to this tour.");
            throw new IllegalArgumentException("The provided Tour Guide is not assigned to this tour.");
        }

        // Check if the tour status is "FINISHED"
        if (!tour.getTourStatus().equals("Finished")) {
            System.out.println("The provided Tour is not finished.");
            throw new IllegalArgumentException("Payment can only be created for tours with status 'FINISHED'.");
        }

        // Check for existing payment for the tour
        Payment existingPayment = paymentRepos.findByTourId(tourId);

        if (existingPayment != null) {
            // Update the existing payment
            existingPayment.setAmount(tour.getDuration() * HOURLY_RATE_TOUR);
            existingPayment.setActivitySubmissionDate(new Date()); // Update payment date
            existingPayment.setStatus("UPDATED");
            return paymentRepos.save(existingPayment);
        } else {
            double amount = tour.getDuration() * HOURLY_RATE_TOUR;

            Payment newPayment = new Payment();
            newPayment.setTourGuide(tourGuide);
            newPayment.setAmount(amount);
            newPayment.setActivitySubmissionDate(new Date());
            newPayment.setStatus("PENDING");
            newPayment.setTourId(tourId);

            return paymentRepos.save(newPayment);
        }
    }

    public Payment calculateAndCreatePaymentForFair(Long fairId, String tourGuideEmail) {
        System.out.println("calculating fair payment");
        // Validate tour
        Fair fair = fairRepos.findById(fairId)
                .orElseThrow(() -> new IllegalArgumentException("Fair not found with ID: " + fairId));

        // Validate tour guide
        TourGuide tourGuide = tourGuideRepos.findByEmail(tourGuideEmail);
        if (tourGuide == null) {
            System.out.println("The provided Tour Guide is not found.");
            throw new IllegalArgumentException("Tour Guide not found with email: " + tourGuideEmail);
        }

        // Ensure the tour guide matches the assigned guide
        if (!fair.getAssignedGuideEmail().equals(tourGuide.getEmail())) {
            System.out.println("The provided Tour Guide is not assigned to this fair.");
            throw new IllegalArgumentException("The provided Tour Guide is not assigned to this fair.");
        }

        // Check if the tour status is "FINISHED"
        if (!fair.getFairStatus().equals("Finished")) {
            System.out.println("The provided Fair is not finished.");
            throw new IllegalArgumentException("Payment can only be created for fairs with status 'FINISHED'.");
        }

        // Check for existing payment for the tour
        Payment existingPayment = paymentRepos.findByFairId(fairId);

        if (existingPayment != null) {
            // Update the existing payment
            existingPayment.setAmount(fair.getDuration() * HOURLY_RATE_FAIR);
            System.out.println("ccccccc");
            existingPayment.setApprovalDate(new Date()); // Update payment date
            existingPayment.setStatus("UPDATED");
            return paymentRepos.save(existingPayment);
        } else {
            System.out.println("cxxxx");
            double amount = fair.getDuration() * HOURLY_RATE_FAIR;

            Payment newPayment = new Payment();
            newPayment.setTourGuide(tourGuide);
            newPayment.setAmount(amount);
            newPayment.setApprovalDate(new Date());
            newPayment.setActivitySubmissionDate(new Date());
            newPayment.setStatus("PENDING");
            newPayment.setFairId(fairId);

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

    public List<Payment> getAllPayments() {
        // Validate tour guide
        return paymentRepos.findAll();
    }

    public List<Payment> getAllPendingAndUpdatedPayments() {
        List<String> statuses = Arrays.asList("PENDING", "UPDATED");
        return paymentRepos.findAllByStatuses(statuses);
    }

}

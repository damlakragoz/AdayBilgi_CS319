package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Payment;
import com.CS319.BTO_Application.Entity.TourGuide;
import com.CS319.BTO_Application.Repos.PaymentRepos;
import com.CS319.BTO_Application.Repos.TourGuideRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private TourGuideService tourGuideService;

    @Autowired
    private MailService mailService;
/*
    public Payment calculatePayments(Long tourGuideId, float tourHourlyRate, float otherActivityHourlyRate) {
        TourGuide guide = tourGuideService.getTourGuideById(tourGuideId);

        // Calculate tour payments
        float totalTourPayment = guide.getAssignedTours().stream()
                .map(tour -> tour.getHoursWorked() * tourHourlyRate)
                .reduce(0f, Float::sum);

        // Calculate other activity payments
        float totalOtherActivityPayment = guide.getOtherActivities().stream()
                .map(activity -> activity.getHoursWorked() * otherActivityHourlyRate)
                .reduce(0f, Float::sum);

        // Calculate total payment
        float totalPayment = totalTourPayment + totalOtherActivityPayment;

        // Create and return payment object
        Payment payment = new Payment(tourGuideId, totalPayment);
        return payment;
    }

    public void sendPaymentReportToFinance(float tourHourlyRate, float otherActivityHourlyRate) {
        List<TourGuide> guides = tourGuideService.getAllTourGuides();

        StringBuilder reportBuilder = new StringBuilder("Guide Name, Total Tour Hours, Total Activity Hours, Total Payment\n");

        for (TourGuide guide : guides) {
            // Calculate payment details
            float tourHours = guide.getAssignedTours().stream()
                    .map(tour -> tour.getHoursWorked())
                    .reduce(0f, Float::sum);

            float activityHours = guide.getOtherActivities().stream()
                    .map(activity -> activity.getHoursWorked())
                    .reduce(0f, Float::sum);

            float totalTourPayment = tourHours * tourHourlyRate;
            float totalOtherActivityPayment = activityHours * otherActivityHourlyRate;
            float totalPayment = totalTourPayment + totalOtherActivityPayment;

            // Append to report
            reportBuilder.append(String.format("%s, %.2f, %.2f, %.2f\n",
                    guide.getFirstName() + " " + guide.getLastName(), tourHours, activityHours, totalPayment));
        }

        // Send email to finance
        mailService.sendMail("finance@example.com", "Monthly Payment Report",
                "Please find the payment report attached." + reportBuilder.toString());
    }

    public List<Payment> viewPaymentActivity(Long tourGuideId) {
    }

 */
}

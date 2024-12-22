package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Coordinator;
import com.CS319.BTO_Application.Entity.Payment;
import com.CS319.BTO_Application.Entity.TourGuide;
import com.CS319.BTO_Application.Repos.CoordinatorRepos;
import com.CS319.BTO_Application.Repos.PaymentRepos;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CoordinatorService {
    private final CoordinatorRepos coordinatorRepos;
    private final PasswordEncoder passwordEncoder;
    private final PaymentRepos paymentRepos;
    private final NotificationService notificationService;
    private final MailService mailService;

    @Autowired
    public CoordinatorService(CoordinatorRepos coordinatorRepos, PasswordEncoder passwordEncoder, PaymentRepos paymentRepos, NotificationService notificationService, MailService mailService) {
        this.coordinatorRepos = coordinatorRepos;
        this.passwordEncoder = passwordEncoder;
        this.paymentRepos = paymentRepos;
        this.notificationService = notificationService;
        this.mailService = mailService;
    }

    public List<Coordinator> getAllCoordinators() {
        return coordinatorRepos.findAll();
    }

    public Coordinator getCoordinatorByEmail(String email) {
        if(!coordinatorRepos.existsByEmail(email)){
            System.out.println("Coordinator Not Found with username " + email);
            return null;
        }
        return coordinatorRepos.findByEmail(email);
    }
    public Coordinator saveCoordinator(Coordinator coordinator) {
        coordinator.setPassword(passwordEncoder.encode(coordinator.getPassword())); //setPassword is new for this one
        return coordinatorRepos.save(coordinator);
    }

    //we may need to remove notifications etc of
    // the coordinator in the future in this method
    @Transactional
    public void deleteCoordinatorByUsername(String username) {
        Coordinator coordinator = coordinatorRepos.findByEmail(username);
        if (coordinator == null) {
            throw new UsernameNotFoundException("Coordinator not found: " + username);
        }
        coordinatorRepos.delete(coordinator);
    }

    //@Transactional
    public Payment approvePayment(Long paymentId, String coordinatorEmail) {
        Coordinator coordinator = coordinatorRepos.findByEmail(coordinatorEmail);
        if (coordinator == null) {
            throw new UsernameNotFoundException("Coordinator not found: " + coordinatorEmail);
        }

        Payment payment = paymentRepos.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));

        if(payment.getStatus().equals("APPROVED")){
            System.out.println("Payment Status is APPROVED");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment is already approved."); //400 BAD REQUEST
        }
        payment.setApprovedBy(coordinatorEmail);
        payment.setApprovalDate(new java.util.Date());
        payment.setStatus("APPROVED");

        // Send notification to tour guide
        TourGuide tourGuide = payment.getTourGuide();
        if (tourGuide != null) {
            String tourGuideEmail = tourGuide.getEmail();
            if (tourGuideEmail != null) {
                String tourGuideText = "Ödeme miktarı: " + payment.getAmount() + "<br>" +
                            "Ödemesi Yapılan Aktivitenin Giriş Tarihi: " + payment.getActivitySubmissionDate();
                notificationService.createNotification(tourGuideEmail,
                                                        "Ödemeniz Yapıldı",
                                                        tourGuideText);
            }
            else {
                System.out.println("Tour Guide Email Not Found In Approve Payment");
            }

            // Send mail to accountant
            String iban = tourGuide.getIban();
            if (iban != null) {
                String accountantEmail = "eray.isci@ug.bilkent.edu.tr";
                String accountantText = "Ad: " + tourGuide.getFirstName() + "<br>" +
                                        "Soyad" + tourGuide.getLastName() + "<br>" +
                                        "Iban" + iban;
                mailService.sendMail(accountantEmail,
                        "Bir Kişinin Ödeme İsteği Geldi",
                        accountantText);
            }
            else {
                System.out.println("Tour Guide Iban Not Found In Approve Payment");
            }
        }
        else {
            System.out.println("Tour Guide Not Found In Approve Payment");
        }



        return paymentRepos.save(payment);
    }
}
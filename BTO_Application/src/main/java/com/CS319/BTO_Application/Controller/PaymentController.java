package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Entity.Payment;
import com.CS319.BTO_Application.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-tour-payment")
    public ResponseEntity<Payment> createPaymentForTour(@RequestParam String tourGuideEmail, @RequestParam Long tourId) {
        try {
            Payment payment = paymentService.calculateAndCreatePaymentForTour(tourId, tourGuideEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(payment);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/create-fair-payment")
    public ResponseEntity<Payment> createPaymentForFair(@RequestParam String tourGuideEmail, @RequestParam Long fairId) {

        try {
            Payment payment = paymentService.calculateAndCreatePaymentForFair(fairId, tourGuideEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(payment);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    // Retrieve payment history for a tour guide
    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory(@RequestParam String tourGuideEmail) {
        try {
            return ResponseEntity.ok(paymentService.getPaymentHistoryByGuide(tourGuideEmail));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + ex.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllPayments() {
        try {
            return ResponseEntity.ok(paymentService.getAllPayments());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + ex.getMessage());
        }
    }

    @GetMapping("/pending/getAll")
    public ResponseEntity<?> getAllPendingAndUpdatedPayments() {
        try {
            return ResponseEntity.ok(paymentService.getAllPendingAndUpdatedPayments());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + ex.getMessage());
        }
    }


}

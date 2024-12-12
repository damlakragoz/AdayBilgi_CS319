package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Entity.Payment;
import com.CS319.BTO_Application.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
/*
    @Autowired
    private PaymentService paymentService;

    @GetMapping("/tourGuide/{tourGuideId}")
    public ResponseEntity<List<Payment>> viewPaymentActivity(@PathVariable Long tourGuideId) {
        List<Payment> payments = paymentService.viewPaymentActivity(tourGuideId);
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/create")
    public ResponseEntity<Payment> createPayment(@RequestParam Long tourGuideId, @RequestParam float amount) {
        Payment payment = paymentService.createPayment(tourGuideId, amount);
        return ResponseEntity.ok(payment);
    }

    @PostMapping("/{paymentId}/approve")
    public ResponseEntity<Payment> approvePayment(@PathVariable Long paymentId) {
        Payment payment = paymentService.approvePayment(paymentId);
        return ResponseEntity.ok(payment);
    }

    @PostMapping("/{paymentId}/reject")
    public ResponseEntity<Payment> rejectPayment(@PathVariable Long paymentId) {
        Payment payment = paymentService.rejectPayment(paymentId);
        return ResponseEntity.ok(payment);
    }*/
}


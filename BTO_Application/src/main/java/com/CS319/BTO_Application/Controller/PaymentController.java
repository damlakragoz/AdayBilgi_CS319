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

    /**
     * Creates a payment for a tour.
     *
     * Preconditions:
     * - `tourGuideEmail` must not be null and must correspond to an existing tour guide.
     * - `tourId` must not be null and must correspond to an existing tour.
     *
     * Postconditions:
     * - The payment is calculated and created.
     * - Returns the created payment with status 201 (CREATED).
     * - If an error occurs, returns status 400 (BAD_REQUEST) or 500 (INTERNAL_SERVER_ERROR).
     *
     * @param tourGuideEmail The email of the tour guide.
     * @param tourId The ID of the tour.
     * @return ResponseEntity containing the created payment or error status.
     */
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

    /**
     * Creates a payment for a fair.
     *
     * Preconditions:
     * - `tourGuideEmail` must not be null and must correspond to an existing tour guide.
     * - `fairId` must not be null and must correspond to an existing fair.
     *
     * Postconditions:
     * - The payment is calculated and created.
     * - Returns the created payment with status 201 (CREATED).
     * - If an error occurs, returns status 400 (BAD_REQUEST) or 500 (INTERNAL_SERVER_ERROR).
     *
     * @param tourGuideEmail The email of the tour guide.
     * @param fairId The ID of the fair.
     * @return ResponseEntity containing the created payment or error status.
     */
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


    /**
     * Retrieves the payment history for a tour guide.
     *
     * Preconditions:
     * - `tourGuideEmail` must not be null and must correspond to an existing tour guide.
     *
     * Postconditions:
     * - Returns a list of payments for the specified tour guide.
     * - If an error occurs, returns status 404 (NOT_FOUND).
     *
     * @param tourGuideEmail The email of the tour guide.
     * @return ResponseEntity containing the list of payments or error status.
     */
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

    /**
     * Retrieves all pending and updated payments.
     *
     * Preconditions:
     * - None.
     *
     * Postconditions:
     * - Returns a list of all pending and updated payments.
     * - If an error occurs, returns status 404 (NOT_FOUND).
     *
     * @return ResponseEntity containing the list of all pending and updated payments or error status.
     */
    @GetMapping("/pending/getAll")
    public ResponseEntity<?> getAllPendingAndUpdatedPayments() {
        try {
            return ResponseEntity.ok(paymentService.getAllPendingAndUpdatedPayments());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + ex.getMessage());
        }
    }


}

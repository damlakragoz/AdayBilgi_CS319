package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Entity.Payment;
import com.CS319.BTO_Application.Service.CoordinatorService;
import com.CS319.BTO_Application.Service.CounselorService;
import com.CS319.BTO_Application.Service.HighSchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coordinator")
public class CoordinatorController {

    private final CoordinatorService coordinatorService;
    private final HighSchoolService highschoolService;

    @Autowired
    public CoordinatorController(CoordinatorService coordinatorService, HighSchoolService highschoolService) {
        this.coordinatorService = coordinatorService;
        this.highschoolService = highschoolService;
    }

    /**
     * Approves a payment.
     *
     * Preconditions:
     * - `paymentId` must not be null and must correspond to an existing payment.
     * - `coordinatorEmail` must not be null and must correspond to an existing coordinator.
     *
     * Postconditions:
     * - Returns the approved payment.
     *
     * @param paymentId The ID of the payment.
     * @param coordinatorEmail The email of the coordinator.
     * @return ResponseEntity containing the approved payment.
     */
    @PutMapping("/approve-payment")
    public ResponseEntity<Payment> approvePayment(
            @RequestParam Long paymentId,
            @RequestParam String coordinatorEmail) {
        Payment approvedPayment = coordinatorService.approvePayment(paymentId, coordinatorEmail);
        return ResponseEntity.ok(approvedPayment);
    }
}
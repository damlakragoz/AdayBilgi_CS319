package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "tour_guide_id", nullable = true)
    private TourGuide tourGuide;

    @Column(name = "tour_id", nullable = true)
    private Long tourId;

    @Column(name = "fair_id", nullable = true)
    private Long fairId;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "activity_submission_date", nullable = false)
    private Date activitySubmissionDate;

    @Column(name = "status", nullable = false)
    private String status; // PENDING, PAID, etc.

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "approval_date")
    private Date approvalDate;
}

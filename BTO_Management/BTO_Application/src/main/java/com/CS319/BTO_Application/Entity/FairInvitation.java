package com.CS319.BTO_Application.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name ="FairInvitation", schema = "bto_database")

public class FairInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = true)
    private Long id;

    @Column(name = "fair_start_date", nullable = false)
    private Date fairStartDate;

    @Column(name = "fair_end_date", nullable = false)
    private Date fairEndDate;

    @Column(name = "STATUS")
    private String status; // Status of the application (e.g., "pending", "approved", "denied")

    @ManyToOne // A counselor can apply for many school tours
    @JoinColumn(name = "counselor_id", referencedColumnName = "id", nullable = true) // Foreign key column for counselor
    private Counselor applyingCounselor; // Counselor who is applying


    @PrePersist
    @PreUpdate
    private void validateDates() {
        if (fairEndDate.before(fairStartDate)) {
            System.out.println("Fair end date must be after the start date.");
            throw new IllegalArgumentException("Fair end date must be after the start date.");
        }
    }



}


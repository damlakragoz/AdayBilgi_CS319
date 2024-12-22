package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
    private LocalDate fairStartDate;

    @Column(name = "fair_end_date", nullable = false)
    private LocalDate fairEndDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime fairStartTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime fairEndTime;

    @Column(name = "invitation_status", nullable = false)
    private String fairInvitationStatus; // Status of the application (e.g., "created", "approved", "cancelled")

    @ManyToOne // A counselor can apply for many school fair
    @JoinColumn(name = "counselor_id", referencedColumnName = "id", nullable = true) // Foreign key column for counselor
    private Counselor applyingCounselor; // Counselor who is applying

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "school_id", referencedColumnName = "id", nullable = true)
    private HighSchool applyingHighschool;

    public HighSchool getApplyingHighschool() {
        return applyingHighschool;
    }

    // transitionTime field
    /*
    @Column(name = "transition_time", nullable = true)
    private LocalDateTime transitionTime;

     */


}


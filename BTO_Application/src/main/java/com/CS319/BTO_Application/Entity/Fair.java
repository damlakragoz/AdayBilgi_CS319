package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Fair", schema = "bto_database")

public class Fair {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = true)
    private Long id;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime; // The selected time slot for the tour

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "assigned_tour_guide", referencedColumnName = "id", nullable = true)
    private TourGuide assignedGuideToFair;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "assigned_executive", referencedColumnName = "id", nullable = true)
    private Executive assignedExecutive;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "school_id", referencedColumnName = "id", nullable = true)
    private HighSchool applyingHighschool;

    @OneToOne
    @JsonBackReference
    @JoinColumn(name = "fair_invitation_id", referencedColumnName = "id", nullable = true)
    private FairInvitation fairInvitation;

    @Column(name = "fair_status", nullable = true)
    private String fairStatus;

    @Column(name = "duration", nullable = true)
    private Double duration; // Duration in hours

    public Fair(LocalDate startDate, LocalDate endDate, String fairStatus, HighSchool applyingHighschool, FairInvitation fairInvitation, LocalTime startTime, LocalTime endTime) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.fairStatus = fairStatus;
        this.applyingHighschool = applyingHighschool;
        this.fairInvitation = fairInvitation;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public String getAssignedGuideEmail() {
        if (assignedGuideToFair == null) {
            return null; // Or return an empty string "" depending on your requirements
        }
        return assignedGuideToFair.getEmail();
    }

    public String getAssignedExecutiveEmail() {
        if (assignedExecutive == null) {
            return null; // Or return an empty string "" depending on your requirements
        }
        return assignedExecutive.getEmail();
    }

}
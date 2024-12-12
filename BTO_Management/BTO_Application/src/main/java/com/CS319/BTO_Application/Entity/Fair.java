package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

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
    private Date startDate;

    @Column(name = "end_date", nullable = false)
    private Date endDate;

    @OneToOne
    @JsonBackReference
    @JoinColumn(name = "feedback", referencedColumnName = "id", nullable = true)
    private Feedback feedback;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "assigned_BTO_member", referencedColumnName = "id", nullable = true)
    private BTOMember assignedBTOMember;

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

    public Fair(Date startDate, Date endDate, BTOMember assignedBTOMember, String fairStatus, HighSchool applyingHighschool, FairInvitation fairInvitation, Feedback feedback) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.assignedBTOMember = assignedBTOMember;
        this.fairStatus = fairStatus;
        this.applyingHighschool = applyingHighschool;
        this.fairInvitation = fairInvitation;
        this.feedback = feedback;
    }

    public FairInvitation getFairInvitation() {
        return fairInvitation;
    }

}










package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "Feedback", schema = "bto_database")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id", unique = true, nullable = false)
    private Long feedbackId;

    @ManyToOne(optional = false) // Ensures a non-null relationship
    @JoinColumn(name = "tour_id", referencedColumnName = "id", nullable = false)
    private Tour tour;

    @Column(name = "rating", nullable = false)
    private int rating;

    @Column(name = "comment", length = 500)
    private String comment;

    @ManyToOne(optional = false)
    @JsonBackReference
    @JoinColumn(name = "counselor_id", referencedColumnName = "id", nullable = false)
    private Counselor counselor;
}

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

    @ManyToOne
    @JoinColumn(name = "tour_id", referencedColumnName = "id", nullable = false)
    private Tour tour; // Associated Tour

    @Column(name = "rating", nullable = false)
    private int rating; // Rating for the tour

    @Column(name = "comment", length = 500)
    private String comment; // Feedback comments

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "counselor_id", referencedColumnName = "id")
    private Counselor counselor;

    public Feedback() {}

    public Feedback(Tour tour, int rating, String comment, Counselor counselor) {
        this.tour = tour;
        this.rating = rating;
        this.comment = comment;
        this.counselor = counselor;
    }
}


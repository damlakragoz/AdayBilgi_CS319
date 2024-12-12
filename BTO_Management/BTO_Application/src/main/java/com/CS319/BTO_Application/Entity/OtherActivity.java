package com.CS319.BTO_Application.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name = "Feedback", schema = "bto_database")
@Entity
public class OtherActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String activityTitle;
    private double workHour;

    @ManyToOne
    @JoinColumn(name = "guide_id")
    private TourGuide guide;

}

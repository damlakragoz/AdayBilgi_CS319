package com.CS319.BTO_Application.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "OtherActivity", schema = "bto_database")
public class OtherActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_id", unique = true, nullable = false)
    private Long activityID;

    @Column(name = "activity_title", nullable = false)
    private String activityTitle;

    @Column(name = "work_hours", nullable = false)
    private double workHours;

    @ManyToOne
    @JoinColumn(name = "tour_guide_id", nullable = false)
    private TourGuide tourGuide;

    public OtherActivity(String activityTitle, double workHours, TourGuide tourGuide) {
        this.activityTitle = activityTitle;
        this.workHours = workHours;
        this.tourGuide = tourGuide;
    }

    public void updateWorkHours(double newWorkHours) {
        this.workHours = newWorkHours;
    }

    public String getActivityDetails() {
        return "Activity: " + activityTitle + ", Hours: " + workHours;
    }
}

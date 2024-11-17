package com.CS319.BTO_Application.entity;

import jakarta.persistence.*;

@Entity
public class SchoolTourApplication extends TourApplication {
    private String id;
    /*@ManyToOne(fetch = FetchType.LAZY) // A counselor can apply for many school tours
    @JoinColumn(name = "counselor_id") // Foreign key column for counselor
    //private Counselor applyingCounselor; // Counselor who is applying

    @ManyToOne(fetch = FetchType.LAZY) // A school can apply for many tours
    @JoinColumn(name = "high_school_id") // Foreign key column for high school
    /*private HighSchool applyingHighSchool; // High school making the application

    // Getters and Setters
    public Counselor getApplyingCounselor() {
        return applyingCounselor;
    }

    public void setApplyingCounselor(Counselor applyingCounselor) {
        this.applyingCounselor = applyingCounselor;
    }

    public HighSchool getApplyingHighSchool() {
        return applyingHighSchool;
    }

    public void setApplyingHighSchool(HighSchool applyingHighSchool) {
        this.applyingHighSchool = applyingHighSchool;
    }

    // Method to add tour application to the scheduler
    public boolean addToScheduler(TourApplication ta) {
        // Implementation for adding the tour application to the scheduler
        // Return true if successfully added, false otherwise
        return true;
    }*/

}

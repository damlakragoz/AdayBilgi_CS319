package com.CS319.BTO_Application.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Counselor {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;  // Primary key for the Counselor entity

    @ManyToOne
    @Column(name = "school_id")  // Foreign key to HighSchool
    private int school_id;

    @Column(name = "tour-applications-list")  // One counselor has many tour applications
    private List<SchoolTourApplication> tourApplicationsList;

    // Getter and Setter methods

    public String getId() {
        return id;
    }

    public int getSchool() {
        return school_id;
    }

    public void setSchool(int school_id) {
        this.school_id = school_id;
    }
}
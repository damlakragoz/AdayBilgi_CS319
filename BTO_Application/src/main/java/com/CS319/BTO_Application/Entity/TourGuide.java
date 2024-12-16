package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "TourGuide", schema = "bto_database")
public class TourGuide extends BTOMember {

    @Column(name = "department", nullable = true)
    private String department;

    @Column(name = "puantage", nullable = true)
    private Long puantage;

    @Column(name = "work_hours", nullable = true)
    private float workHours;

    @Column(name = "grade", nullable = true)
    private int grade;

    @Column(name = "iban", nullable = true)
    private String iban;

    @OneToMany(mappedBy = "assignedGuide", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Tour> enrolledTours;
    /*
    TODO:
     -paymentHistory: List<Payment>
     -currentPayment: Payment
     -tours: List<Tour>
     -otherActivities: List<OtherActivities>
      */

    @OneToMany(mappedBy = "tourGuide", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Payment> paymentHistory;

    @OneToMany(mappedBy = "tourGuide", cascade = CascadeType.ALL)
    private List<OtherActivity> otherActivities;

    public TourGuide(String email, String password, String role) {
        this.setEmail(email);
        this.setPassword(password);
        this.setRole(role);
    }

    public TourGuide(String email, String password, String firstName, String lastName, String phoneNumber, String role) {
        this.setEmail(email);
        this.setPassword(password);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setPhoneNumber(phoneNumber);
        this.setRole(role);
    }

}

package com.CS319.BTO_Application.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "TourGuide", schema = "kubra_db")
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

    /*
    TODO:
     -paymentHistory: List<Payment>
     -currentPayment: Payment
     -tours: List<Tour>
     -otherActivities: List<OtherActivities>
     */

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

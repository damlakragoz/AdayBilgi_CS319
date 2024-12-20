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
    private Double workHours;

    @Column(name = "grade", nullable = true)
    private Integer grade;

    @Column(name = "iban", nullable = true)
    private String iban;

    @OneToMany(mappedBy = "assignedGuide",cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonManagedReference
    private List<Tour> enrolledTours;

    @OneToMany(mappedBy = "assignedGuideToFair",cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonManagedReference
    private List<Fair> enrolledFairs;
    /*
    TODO:
     -paymentHistory: List<Payment>
     -currentPayment: Payment
     -tours: List<Tour>
     -otherActivities: List<OtherActivities>
      */

    @OneToMany(mappedBy = "tourGuide", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonManagedReference
    private List<Payment> paymentHistory;

    @OneToMany(mappedBy = "tourGuide", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
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

    public TourGuide(String email, String password, String firstName, String lastName,
                     String phoneNumber, String department, Integer grade, String iban, Double workHours) {
        this.setEmail(email);
        this.setPassword(password);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setPhoneNumber(phoneNumber);
        this.setDepartment(department);
        this.setGrade(grade);
        this.setIban(iban);
        this.setRole("TourGuide");
        this.setWorkHours(workHours);
    }

}

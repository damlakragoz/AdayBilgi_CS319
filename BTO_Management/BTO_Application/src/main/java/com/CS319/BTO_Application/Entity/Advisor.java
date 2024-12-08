package com.CS319.BTO_Application.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Advisor", schema = "bto_database")
public class Advisor extends TourGuide{

    @Column(name = "assigned_day", nullable = true)
    private String assignedDay;

    public Advisor(String email, String password, String firstName, String lastName, String phoneNumber, String assignedDay, String role) {
        this.setEmail(email);
        this.setPassword(password);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setPhoneNumber(phoneNumber);
        this.setAssignedDay(assignedDay);
        this.setRole(role);
    }
}

package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "Coordinator", schema = "kubra_db")
public class Coordinator extends BTOManager {

    //TODO Initialize Payment Service

    public Coordinator(String email, String password, String role) {
        this.setEmail(email); // email is user's Bilkent mail
        this.setPassword(password);
        this.setRole(role);
    }

    public Coordinator(String email, String password, String firstName, String lastName, String phoneNumber, String role) {
        this.setEmail(email);
        this.setPassword(password);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setPhoneNumber(phoneNumber);
        this.setRole(role);
    }
}


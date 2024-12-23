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
@Entity
@Table(name = "Admin", schema = "bto_database")
public class Admin extends BTOMember {

    public Admin(String email, String password, String role) {
        this.setEmail(email); // email is user's Bilkent mail
        this.setPassword(password);
        this.setRole(role);
    }

    public Admin(String email, String password, String firstName, String lastName, String phoneNumber, String role) {
        this.setEmail(email);
        this.setPassword(password);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setPhoneNumber(phoneNumber);
        this.setRole(role);
    }
}

package com.CS319.BTO_Application.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "Executive", schema = "kubra_db")
public class Executive extends BTOManager{
    public Executive(String email, String password, String firstName, String lastName, String phoneNumber, String role) {
       this.setEmail(email);
       this.setPassword(password);
       this.setFirstName(firstName);
       this.setLastName(lastName);
       this.setPhoneNumber(phoneNumber);
       this.setRole(role);
    }
}



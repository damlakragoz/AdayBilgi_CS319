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
@Table(name = "Coordinator", schema = "bto_database")
public class Coordinator extends User {
    public Coordinator(String username, String password, String role) {
        this.setUsername(username); // Username is user's Bilkent ID
        this.setPassword(password);
        this.setRole(role);
    }
}


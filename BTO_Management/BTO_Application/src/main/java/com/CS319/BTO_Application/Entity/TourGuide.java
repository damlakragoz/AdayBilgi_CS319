package com.CS319.BTO_Application.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "TourGuide", schema = "bto_database")
public class TourGuide extends User{

    private long puantage;

    public TourGuide(String username, String password, String role) {
        this.setUsername(username);
        this.setPassword(password);
        this.setRole(role);
        this.puantage = 0;
    }
}


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
@Table(name = "TourGuide", schema = "bto_database")
public class TourGuide extends User {

    @Column(name = "puantage", nullable = true)
    private Long puantage;
    @Column(name = "department", nullable = true)
    private String department;
    @Column(name = "work_hours", nullable = true)
    private float workHours;
    @Column(name = "has_graduated", nullable = true)
    private boolean hasGraduated;
    // List<Tour>

    public TourGuide(String username, String password, String role) {
        this.setUsername(username);
        this.setPassword(password);
        this.setRole(role);
    }
}


package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Counselor", schema = "bto_database")
public class Counselor extends User{

    /*
    the tour application can be held here
     */
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "school_id", referencedColumnName = "id", nullable = false)
    private HighSchool highSchool;

    @OneToMany(mappedBy = "counselor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Feedback> feedbacks;

    public Counselor(String email, String password, String role, HighSchool highSchool) {
        if (highSchool == null) {
            throw new IllegalArgumentException("HighSchool cannot be null for Counselor.");
        }
        this.setEmail(email);
        this.setPassword(password);
        this.setRole(role);
        this.highSchool = highSchool;
    }

    public Counselor(String email, String password, String firstName, String lastName, String phoneNumber, String role, HighSchool highSchool) {
        this(email, password, role, highSchool);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setPhoneNumber(phoneNumber);
    }

    public String getSchoolName() {
        return highSchool != null ? highSchool.getSchoolName() : null;
    }

    public Long getSchoolId() {
        return highSchool != null ? highSchool.getId() : null;
    }

    public void addFeedback(Feedback feedback) {
        if (feedbacks == null) {
            feedbacks = new ArrayList<>();
        }
        feedback.setCounselor(this);
        this.feedbacks.add(feedback);
    }

    public void removeFeedback(Feedback feedback) {
        if (feedbacks != null) {
            this.feedbacks.remove(feedback);
            feedback.setCounselor(null);
        }
    }
}

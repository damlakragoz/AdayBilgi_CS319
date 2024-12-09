
package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "Counselor", schema = "bto_database")
public class Counselor extends User{

    /*
    the tour application can be held here
     */
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "school_id", referencedColumnName = "id", nullable = false) // referencedcolumnname: parenttaki primary
    private HighSchool highSchool;

    //TODO:
    //Feedback


    public Counselor(String email, String password, String role, HighSchool highSchool) {
        this.setEmail(email);
        this.setPassword(password);
        this.setRole(role);
        this.highSchool = highSchool;
    }

    public Counselor(String email, String password, String firstName, String lastName, String phoneNumber, String role, HighSchool highSchool) {
        this.setEmail(email);
        this.setPassword(password);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setPhoneNumber(phoneNumber);
        this.setRole(role);
        this.highSchool = highSchool;
    }


    public String getSchoolName() {
        return highSchool.getSchoolName();
    }
    public Long getSchoolId() {
        return highSchool.getId();
    }
}


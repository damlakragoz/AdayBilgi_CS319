
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
@Entity
@Table(name = "Counselor", schema = "bto_database")
public class Counselor extends User{

    /*
    the tour application can be held here
     */
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "school_id", referencedColumnName = "id") // referencedcolumnname: parenttaki primary
    private HighSchool highSchool;

    public Counselor(String username, String password, String role, HighSchool highSchool) {
        this.setUsername(username);
        this.setPassword(password);
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


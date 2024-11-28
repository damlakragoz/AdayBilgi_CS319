
package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Highschool", schema = "bto_database")
public class HighSchool {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @Column(name = "name", nullable = false)
    private String schoolName;

    @OneToMany(mappedBy = "highSchool", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Counselor> counselors;

    public HighSchool(String schoolName) {
        this.schoolName = schoolName;
    }

}



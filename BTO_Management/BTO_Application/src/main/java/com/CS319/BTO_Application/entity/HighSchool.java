
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
    private Long id;

    @Column(name = "name", nullable = false)
    private String schoolName;

    @OneToMany(mappedBy = "highSchool", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Counselor> counselors;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "total_tour_count", nullable = true)
    private Integer totalTourCount;

    @Column(name = "priority_point", nullable = true)
    private Integer priorityPoint;
    //TODO: Initialize Statistics

    public HighSchool(String schoolName, String city, Integer priorityPoint) {
        this.schoolName = schoolName;
        this.city = city;
        this.priorityPoint = priorityPoint;
    }

}

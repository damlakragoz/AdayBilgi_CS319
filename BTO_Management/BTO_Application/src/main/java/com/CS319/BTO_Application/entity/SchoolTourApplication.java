
package com.CS319.BTO_Application.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // Use SINGLE_TABLE strategy
public class SchoolTourApplication extends TourApplication {

    @ManyToOne // A counselor can apply for many school tours
    @JoinColumn(name = "counselor_id", referencedColumnName = "id", nullable = true) // Foreign key column for counselor
    private Counselor applyingCounselor; // Counselor who is applying

    /*
    @ManyToOne // A highschool can apply for many school tours
    @JoinColumn(name = "highschool_id", referencedColumnName = "id", nullable = false) // Foreign key column for counselor
    private Counselor applyingHighSchool; // Highschool of applying counselor

     */
}




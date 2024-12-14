
package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "School_Tour_Application", schema = "bto_database")
public class SchoolTourApplication extends TourApplication {

    @ManyToOne // A counselor can apply for many school tours
    @JoinColumn(name = "counselor_id", referencedColumnName = "id", nullable = true) // Foreign key column for counselor
    private Counselor applyingCounselor; // Counselor who is applying

}


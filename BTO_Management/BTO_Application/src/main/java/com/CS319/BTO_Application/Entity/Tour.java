
package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "Tour", schema = "bto_database")
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "visitor_count", nullable = true)
    private Integer visitorCount;

    @Column(name = "description", nullable = true, length = 1000)
    private String description;

    @Column(name = "status", nullable = true)
    private String status;

    @Column(name = "date", nullable = false)
    private Date date;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "assigned_guide_id", referencedColumnName = "id", nullable = true)
    private TourGuide assignedGuide;

    /*
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "school_id", referencedColumnName = "id", nullable = true)
    private HighSchool highschool;

     */
}

    /*
    TODO:
        feedback
        timeslot
        advisorId
     */






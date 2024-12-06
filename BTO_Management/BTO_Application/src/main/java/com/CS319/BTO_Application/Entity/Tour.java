
package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Tour", schema = "bto_database")
public class Tour extends TourEvent{

    @Column(name = "chosen_date", nullable = false)
    private Date chosenDate;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "assigned_guide_id", referencedColumnName = "id", nullable = true)
    private TourGuide assignedGuide;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "school_id", referencedColumnName = "id", nullable = true)
    private HighSchool applyingHighschool; // this goes for both individual and schoolTours

    /*
        this was needed so badly I included it otherwise we would have no way checking
        the connection to the application when the tour is created
     */
    @OneToOne
    @JsonBackReference
    @JoinColumn(name = "tour_application_id", referencedColumnName = "id", nullable = true)
    private TourApplication tourApplication; // this goes for both individual and schoolTours

    @Column(name = "tour_status", nullable = true)
    private String tourStatus;



    public Tour(Integer visitorCount, Date chosenDate, String status, HighSchool applyingHighschool, TourApplication tourApplication) {
        this.setVisitorCount(visitorCount);
        this.setChosenDate(chosenDate);
        this.setTourStatus(status);
        this.setApplyingHighschool(applyingHighschool);
        this.setTourApplication(tourApplication);
    }

    public TourApplication getTourApplication() {
        return tourApplication;
    }
}
    /*
    TODO:
        feedback
        timeslot
        advisorId
     */







package com.CS319.BTO_Application.Entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Tour", schema = "bto_database")
public class Tour extends TourEvent{

    @Column(name = "chosen_date", nullable = false)
    private LocalDate chosenDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "chosen_time_slot", nullable = false)
    private TimeSlot chosenTimeSlot; // The selected time slot for the tour

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

    @Column(name = "duration", nullable = true)
    private Double duration; // Duration in hours

    public Tour(Integer visitorCount, TimeSlot timeSlot, LocalDate chosenDate, String status, HighSchool applyingHighschool, TourApplication tourApplication) {
        this.setVisitorCount(visitorCount);
        this.setChosenTimeSlot(timeSlot);
        this.setChosenDate(chosenDate);
        this.setTourStatus(status);
        this.setApplyingHighschool(applyingHighschool);
        this.setTourApplication(tourApplication);
    }

    public String getAssignedGuideEmail() {
        if (assignedGuide == null) {
            return null; // Or return an empty string "" depending on your requirements
        }
        return assignedGuide.getEmail();
    }

}
    /*
    TODO:
        feedback
        timeslot
        advisorId
     */






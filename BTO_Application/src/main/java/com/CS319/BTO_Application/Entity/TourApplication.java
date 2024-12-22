
package com.CS319.BTO_Application.Entity;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

//@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
//@DiscriminatorColumn(name = "tour_type", discriminatorType = DiscriminatorType.STRING)
@Entity
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class TourApplication extends TourEvent{

    @ElementCollection
    @CollectionTable(
            name = "TourApplication_RequestedDates", // Name of the secondary table
            joinColumns = @JoinColumn(name = "tour_application_id") // Foreign key to link to TourApplication
    )
    @Column(name = "requested_date") // Name of the column in the secondary table
    private List<RequestedDateTime> requestedDates;

    @Column(name = "application_status", nullable = true)
    private String applicationStatus;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "school_id", referencedColumnName = "id", nullable = true)
    private HighSchool applyingHighschool;

    // transitionTime field
    @Column(name = "transition_time", nullable = true)
    private LocalDateTime transitionTime;

    @Column(name = "application_time", nullable = true)
    private LocalDateTime applicationTime;

    @Column(name = "selected_date", nullable = true)
    private LocalDate selectedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "selected_time_slot", nullable = true)
    private TimeSlot selectedTimeSlot; // The selected time slot for the tour application

    public String getHighschoolName(){
        if(applyingHighschool != null){
            return applyingHighschool.getSchoolName();
        }
        return null;
    }

}


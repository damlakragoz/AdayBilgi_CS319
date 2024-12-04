
package com.CS319.BTO_Application.Entity;
import java.util.Date;
import java.util.List;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

//@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
//@DiscriminatorColumn(name = "tour_type", discriminatorType = DiscriminatorType.STRING)
@Entity
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class TourApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true, nullable = false)
    private Long id;

    @ElementCollection
    @CollectionTable(
            name = "TourApplication_RequestedDates", // Name of the secondary table
            joinColumns = @JoinColumn(name = "tour_application_id") // Foreign key to link to TourApplication
    )
    @Column(name = "requested_date") // Name of the column in the secondary table
    private List<Date> requestedDates;

    @Column(name = "visitor-count")
    private int visitorCount; // Number of visitors attending the tour


    @Column(name = "status")
    private String status; // Status of the application (e.g., "pending", "approved", "denied")

}





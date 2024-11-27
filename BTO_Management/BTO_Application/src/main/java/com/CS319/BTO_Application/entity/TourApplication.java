
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
@Table(name = "TourApplication", schema = "bto_database")
public abstract class TourApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID",unique = true, nullable = true)
    private Long id;

    @ElementCollection
    @CollectionTable(
            name = "TourApplication_RequestedDates", // Name of the secondary table
            joinColumns = @JoinColumn(name = "tour_application_id") // Foreign key to link to TourApplication
    )
    @Column(name = "requested_date") // Name of the column in the secondary table
    private List<Date> requestedDates;

    @Column(name = "VISITOR-COUNT")
    private int visitorCount; // Number of visitors attending the tour


    @Column(name = "STATUS")
    private String status; // Status of the application (e.g., "pending", "approved", "denied")

}





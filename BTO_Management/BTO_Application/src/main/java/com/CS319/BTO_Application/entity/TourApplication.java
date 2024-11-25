
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
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID",unique = true, nullable = false)
    private Long id;

    @Column(name = "REQUEST-DATES") // this will be changed to list
    private Date requestedDate;
    // List of requested dates for the tour

    @Column(name = "VISITOR-COUNT")
    private int visitorCount; // Number of visitors attending the tour


    @Column(name = "STATUS")
    private String status; // Status of the application (e.g., "pending", "approved", "denied")

}





package com.CS319.BTO_Application.entity;
import java.util.Date;
import java.util.List;
import jakarta.persistence.*;


@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tour_type", discriminatorType = DiscriminatorType.STRING)
public abstract class TourApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID",unique = true, nullable = false)
    private String id;

    @Column(name = "REQUEST-DATES")
    private List<Date> requestedDates; // List of requested dates for the tour
    @Column(name = "VISITOR-COUNT")
    private int visitorCount; // Number of visitors attending the tour
    @Column(name = "STATUS")
    private String status; // Status of the application (e.g., "pending", "approved", "denied")

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<Date> getRequestedDates() {
        return requestedDates;
    }

    public void setRequestedDates(List<Date> requestedDates) {
        this.requestedDates = requestedDates;
    }

    public int getVisitorCount() {
        return visitorCount;
    }

    public void setVisitorCount(int visitorCount) {
        this.visitorCount = visitorCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

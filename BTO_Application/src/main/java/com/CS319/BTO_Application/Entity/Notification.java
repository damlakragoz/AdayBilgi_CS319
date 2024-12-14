package com.CS319.BTO_Application.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "notification_type", nullable = true, length = 50)
    private String notificationType; // Type of notification (e.g., "Email", "Payment", "Schedule")

    @Column(name = "message", nullable = true, columnDefinition = "TEXT")
    private String message;          // The message of the notification

    @Column(name = "receiver_id", nullable = true)
    private Long receiverID;       // The ID of the user receiving the notification

    @Column(name = "is_read", nullable = true)
    private Boolean isRead;          // Status of the notification (read or unread)

    @Column(name = "is_flagged", nullable = true)
    private Boolean isFlagged;          // Status of the notification (flagged or unflagged)

    @Column(name = "timestamp", nullable = true)
    private LocalDate timestamp; // When the notification was created

    // Constructor
    public Notification(String notificationType, String message, Long receiverID, Boolean isRead, Boolean isFlagged , LocalDate timestamp) {
        this.notificationType = notificationType;
        this.message = message;
        this.receiverID = receiverID;
        this.isRead = isRead;
        this.isFlagged = isFlagged;
        this.timestamp = timestamp;
    }

    // toString
    @Override
    public String toString() {
        return "Notification{" +
                "id=" + id +
                ", notificationType='" + notificationType + '\'' +
                ", message='" + message + '\'' +
                ", receiverID=" + receiverID +
                ", isRead=" + isRead +
                ", isFlagged=" + isFlagged +
                ", timestamp=" + timestamp +
                '}';
    }
}

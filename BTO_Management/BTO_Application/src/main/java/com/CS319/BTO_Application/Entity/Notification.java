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

    @Column(name = "title", nullable = true, length = 100)
    private String title; // Title of the notification

    @Column(name = "text", nullable = true, columnDefinition = "TEXT")
    private String text; // Detailed text of the notification

    @Column(name = "receiver_name", nullable = true)
    private String receiverName; // Name of the user receiving the notification

    @Column(name = "is_read", nullable = true)
    private Boolean isRead; // Status of the notification (read or unread)

    @Column(name = "is_flagged", nullable = true)
    private Boolean isFlagged; // Status of the notification (flagged or unflagged)

    @Column(name = "timestamp", nullable = true)
    private LocalDateTime timestamp; // When the notification was created

    // Constructor
    public Notification(String title, String text, String receiverName, Boolean isRead, Boolean isFlagged, LocalDateTime timestamp) {
        this.title = title;
        this.text = text;
        this.receiverName = receiverName;
        this.isRead = isRead;
        this.isFlagged = isFlagged;
        this.timestamp = timestamp;
    }

    // toString
    @Override
    public String toString() {
        return "Notification{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", text='" + text + '\'' +
                ", receiverName='" + receiverName + '\'' +
                ", isRead=" + isRead +
                ", isFlagged=" + isFlagged +
                ", timestamp=" + timestamp +
                '}';
    }
}
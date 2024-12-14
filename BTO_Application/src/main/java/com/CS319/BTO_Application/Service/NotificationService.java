package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Notification;
import com.CS319.BTO_Application.Repos.NotificationRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    private final NotificationRepos notificationRepos;
    // Map to store notification templates
    private final Map<String, String> templates = new HashMap<>();

    @Autowired
    public NotificationService(NotificationRepos notificationRepos) {
        this.notificationRepos = notificationRepos;
        initializeTemplates();
    }

    // Initialize the templates
    private void initializeTemplates() {
        templates.put("Email", "Dear User, You have received an email notification.");
        templates.put("Payment", "Payment has been successfully processed.");
        templates.put("Schedule", "A new schedule has been created for you.");
        templates.put("Reminder", "This is a reminder for your upcoming event.");
    }

    // Fetch the template based on notification type
    private String getTemplate(String notificationType) {
        return templates.getOrDefault(notificationType, "Default notification message.");
    }

    // Method to create and save a new notification
    public Notification createNotification(String notificationType, Long receiverID) {
        String message = getTemplate(notificationType);
        Notification notification = new Notification(notificationType, message,receiverID, false, false, LocalDate.now()
        );
        notificationRepos.save(notification);
        return notification;
    }

    // Delete a notification by ID
    public boolean deleteNotification(Long notificationId) {
        if (notificationRepos.existsById(notificationId)) {
            notificationRepos.deleteById(notificationId);
            return true;
        }
        throw new RuntimeException("Notification not found");
    }

    // Flag a notification
    public Notification flagNotification(Long notificationId) {
        Notification notification = notificationRepos.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsFlagged(true); // Update flagged
        notificationRepos.save(notification);
        return notification;
    }

    // Unflag a notification
    public Notification unflagNotification(Long notificationId) {
        Notification notification = notificationRepos.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsFlagged(false); // Update unflagged
        notificationRepos.save(notification);
        return notification;
    }

    // Get flagged notifications for a user
    public List<Notification> getFlaggedNotifications(Long receiverID) {
        return notificationRepos.findByReceiverIDAndIsFlagged(receiverID, true);
    }

    // Method to retrieve unread notifications for a user
    public List<Notification> getUnreadNotifications(Long receiverID) {
        return notificationRepos.findByReceiverIDAndIsRead(receiverID, false);
    }

    // Method to retrieve all notifications for a user, ordered by timestamp
    public List<Notification> getAllNotifications(Long receiverID) {
        return notificationRepos.findByReceiverIDOrderByTimestampDesc(receiverID);
    }

    // Mark a notification as read
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepos.findById(notificationId).orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notificationRepos.save(notification);
        return notification;
    }
}
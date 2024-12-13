package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Notification;
import com.CS319.BTO_Application.Repos.NotificationRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepos notificationRepos;
    private final NotificationTemplateService templateService;

    @Autowired
    public NotificationService(NotificationRepos notificationRepos, NotificationTemplateService templateService) {
        this.notificationRepos = notificationRepos;
        this.templateService = templateService;
    }

    // Method to create and save a new notification
    public Notification createNotification(String notificationType, Long receiverID) {
        String subject = templateService.getSubject(notificationType);
        String text = templateService.getText(notificationType);
        String message = subject + "\n" + text;
        Notification notification = new Notification(notificationType, message,receiverID, false, false, LocalDateTime.now()
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
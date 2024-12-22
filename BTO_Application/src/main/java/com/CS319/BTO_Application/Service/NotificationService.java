package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Notification;
import com.CS319.BTO_Application.Repos.NotificationRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    private final NotificationRepos notificationRepos;
    private final NotificationTemplateService templateService;
    private final MailService mailService;

    @Autowired
    public NotificationService(NotificationRepos notificationRepos, NotificationTemplateService templateService, MailService mailService) {
        this.notificationRepos = notificationRepos;
        this.templateService = templateService;
        this.mailService = mailService;
    }

    /**
     * Creates and saves a new notification for the given receiver.
     *
     * Preconditions:
     * - `receiverName`, `title`, and `text` must not be null or empty.
     *
     * Postconditions:
     * - A new `Notification` entity is saved in the repository.
     * - The created notification is returned.
     *
     * @param receiverName The name or email of the notification receiver.
     * @param title        The title of the notification.
     * @param text         The content of the notification.
     * @return The saved `Notification` entity.
     */
    public Notification createNotification(String receiverName, String title, String text) {
        Notification notification = new Notification(title, text, receiverName, false, false, LocalDateTime.now()
        );
        notificationRepos.save(notification);
        //mailService.sendMail(receiverName, title, text);
        return notification;
    }

    /**
     * Deletes a notification by its ID.
     *
     * Preconditions:
     * - `notificationId` must correspond to an existing notification.
     *
     * Postconditions:
     * - The notification is removed from the repository if it exists.
     * - Throws a `RuntimeException` if the notification does not exist.
     *
     * @param notificationId The ID of the notification to delete.
     * @return `true` if the notification was deleted successfully.
     */
    public boolean deleteNotification(Long notificationId) {
        if (notificationRepos.existsById(notificationId)) {
            notificationRepos.deleteById(notificationId);
            return true;
        }
        throw new RuntimeException("Notification not found");
    }

    /**
     * Flags a notification as important.
     *
     * Preconditions:
     * - `notificationId` must correspond to an existing notification.
     *
     * Postconditions:
     * - The `isFlagged` field of the notification is set to `true`.
     * - The updated notification is saved and returned.
     *
     * @param notificationId The ID of the notification to flag.
     * @return The updated `Notification` entity.
     */    public Notification flagNotification(Long notificationId) {
        Notification notification = notificationRepos.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsFlagged(true); // Update flagged
        notificationRepos.save(notification);
        return notification;
    }

    /**
     * Unflags a notification.
     *
     * Preconditions:
     * - `notificationId` must correspond to an existing notification.
     *
     * Postconditions:
     * - The `isFlagged` field of the notification is set to `false`.
     * - The updated notification is saved and returned.
     *
     * @param notificationId The ID of the notification to unflag.
     * @return The updated `Notification` entity.
     */    public Notification unflagNotification(Long notificationId) {
        Notification notification = notificationRepos.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsFlagged(false); // Update unflagged
        notificationRepos.save(notification);
        return notification;
    }

    /**
     * Retrieves all flagged notifications for a specific receiver.
     *
     * Preconditions:
     * - `receiverName` must not be null or empty.
     *
     * Postconditions:
     * - Returns a list of flagged notifications sorted by timestamp in descending order.
     *
     * @param receiverName The name or email of the notification receiver.
     * @return A list of flagged `Notification` entities.
     */    public List<Notification> getFlaggedNotifications(String receiverName) {
        return notificationRepos.findByReceiverNameAndIsFlaggedOrderByTimestampDesc(receiverName, true);
    }

    /**
     * Retrieves all unread notifications for a specific receiver.
     *
     * Preconditions:
     * - `receiverName` must not be null or empty.
     *
     * Postconditions:
     * - Returns a list of unread notifications sorted by timestamp in descending order.
     *
     * @param receiverName The name or email of the notification receiver.
     * @return A list of unread `Notification` entities.
     */    public List<Notification> getUnreadNotifications(String receiverName) {
        return notificationRepos.findByReceiverNameAndIsReadOrderByTimestampDesc(receiverName, false);
    }

    /**
     * Retrieves all notifications for a specific receiver.
     *
     * Preconditions:
     * - `receiverName` must not be null or empty.
     *
     * Postconditions:
     * - Returns a list of notifications sorted by timestamp in descending order.
     *
     * @param receiverName The name or email of the notification receiver.
     * @return A list of `Notification` entities.
     */    public List<Notification> getAllNotifications(String receiverName) {
        return notificationRepos.findByReceiverNameOrderByTimestampDesc(receiverName);
    }

    /**
     * Marks a notification as read.
     *
     * Preconditions:
     * - `notificationId` must correspond to an existing notification.
     *
     * Postconditions:
     * - The `isRead` field of the notification is set to `true`.
     * - The updated notification is saved and returned.
     *
     * @param notificationId The ID of the notification to mark as read.
     * @return The updated `Notification` entity.
     */    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepos.findById(notificationId).orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notificationRepos.save(notification);
        return notification;
    }
}
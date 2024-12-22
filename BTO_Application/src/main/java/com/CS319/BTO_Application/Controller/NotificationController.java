package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.NotificationRequest;
import com.CS319.BTO_Application.Service.MailService;
import com.CS319.BTO_Application.Service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }


    /**
     * Creates a new notification.
     *
     * Preconditions:
     * - `notificationRequest` must not be null.
     * - `notificationRequest.receiverName`, `notificationRequest.title`, and `notificationRequest.text` must not be null.
     *
     * Postconditions:
     * - The notification is created and saved in the repository.
     * - Returns the created notification with status 201 (CREATED).
     *
     * @param notificationRequest The notification request details.
     * @return ResponseEntity containing the created notification.
     */
    @PostMapping("/create")
    public ResponseEntity<?> createNotification(@RequestBody NotificationRequest notificationRequest) {

        return new ResponseEntity<>(notificationService.createNotification(notificationRequest.getReceiverName(),
                                                                            notificationRequest.getTitle(),
                                                                            notificationRequest.getText()),
                HttpStatus.CREATED);
    }


    /**
     * Creates a new notification.
     *
     * Preconditions:
     * - `notificationRequest` must not be null.
     * - `notificationRequest.receiverName`, `notificationRequest.title`, and `notificationRequest.text` must not be null.
     *
     * Postconditions:
     * - The notification is created and saved in the repository.
     * - Returns the created notification with status 201 (CREATED).
     *
     * @param receiverName The notification request details.
     * @return ResponseEntity containing the created notification.
     */
    @GetMapping("/flagged")
    public ResponseEntity<?> getFlaggedNotifications(@RequestParam String receiverName) {
        return new ResponseEntity<>(notificationService.getFlaggedNotifications(receiverName), HttpStatus.OK);
    }


    /**
     * Retrieves unread notifications for a specific user.
     *
     * Preconditions:
     * - `receiverName` must not be null and must correspond to an existing user.
     *
     * Postconditions:
     * - Returns a list of unread notifications for the specified user.
     *
     * @param receiverName The name of the notification receiver.
     * @return ResponseEntity containing the list of unread notifications.
     */
    // Endpoint to retrieve unread notifications for a user
    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadNotifications(@RequestParam String receiverName) {
        return new ResponseEntity<>(notificationService.getUnreadNotifications(receiverName),
                HttpStatus.ACCEPTED);
    }


    /**
     * Retrieves all notifications for a specific user.
     *
     * Preconditions:
     * - `receiverName` must not be null and must correspond to an existing user.
     *
     * Postconditions:
     * - Returns a list of all notifications for the specified user.
     *
     * @param receiverName The name of the notification receiver.
     * @return ResponseEntity containing the list of all notifications.
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllNotifications(@RequestParam String receiverName) {
        return new ResponseEntity<>(notificationService.getAllNotifications(receiverName),
                HttpStatus.ACCEPTED);
    }

    /**
     * Deletes a notification by ID.
     *
     * Preconditions:
     * - `notificationId` must not be null and must correspond to an existing notification.
     *
     * Postconditions:
     * - The specified notification is deleted.
     * - Returns a success message.
     *
     * @param notificationId The ID of the notification to delete.
     * @return ResponseEntity containing the success message.
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteNotification(@RequestParam Long notificationId) {
        return new ResponseEntity<>(notificationService.deleteNotification(notificationId), HttpStatus.OK);
    }

    /**
     * Flags a notification by ID.
     *
     * Preconditions:
     * - `notificationId` must not be null and must correspond to an existing notification.
     *
     * Postconditions:
     * - The specified notification is flagged.
     * - Returns a success message.
     *
     * @param notificationId The ID of the notification to flag.
     * @return ResponseEntity containing the success message.
     */
    @PutMapping("/flag")
    public ResponseEntity<?> flagNotification(@RequestParam Long notificationId) {
        return new ResponseEntity<>(notificationService.flagNotification(notificationId), HttpStatus.OK);
    }

    /**
     * Unflags a notification by ID.
     *
     * Preconditions:
     * - `notificationId` must not be null and must correspond to an existing notification.
     *
     * Postconditions:
     * - The specified notification is unflagged.
     * - Returns a success message.
     *
     * @param notificationId The ID of the notification to unflag.
     * @return ResponseEntity containing the success message.
     */
    @PutMapping("/unflag")
    public ResponseEntity<?> unflagNotification(@RequestParam Long notificationId) {
        return new ResponseEntity<>(notificationService.unflagNotification(notificationId), HttpStatus.OK);
    }

    /**
     * Marks a notification as read by ID.
     *
     * Preconditions:
     * - `notificationId` must not be null and must correspond to an existing notification.
     *
     * Postconditions:
     * - The specified notification is marked as read.
     * - Returns a success message.
     *
     * @param notificationId The ID of the notification to mark as read.
     * @return ResponseEntity containing the success message.
     */
    @PutMapping("/mark-as-read")
    public ResponseEntity<?> markAsRead(@RequestParam Long notificationId) {
        return new ResponseEntity<>(notificationService.markAsRead(notificationId),
                HttpStatus.ACCEPTED);
    }
}
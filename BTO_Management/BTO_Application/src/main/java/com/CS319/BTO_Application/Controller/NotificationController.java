package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.NotificationRequest;
import com.CS319.BTO_Application.Entity.Notification;
import com.CS319.BTO_Application.Service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Endpoint to create a notification (e.g., triggered by events)
    @PostMapping("/create")
    public ResponseEntity<?> createNotification(@RequestBody NotificationRequest notificationRequest) {
        return new ResponseEntity<>(notificationService.createNotification(notificationRequest.getNotificationType(),
                                                                            notificationRequest.getReceiverId()),
                                    HttpStatus.CREATED);
    }

    @GetMapping("/flagged")
    public ResponseEntity<?> getFlaggedNotifications(@RequestParam Long receiverId) {
        return new ResponseEntity<>(notificationService.getFlaggedNotifications(receiverId), HttpStatus.OK);
    }

    // Endpoint to retrieve unread notifications for a user
    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadNotifications(@RequestParam Long receiverId) {
        return new ResponseEntity<>(notificationService.getUnreadNotifications(receiverId),
                                    HttpStatus.ACCEPTED);
    }

    // Endpoint to retrieve all notifications for a user
    @GetMapping("/all")
    public ResponseEntity<?> getAllNotifications(@RequestParam Long receiverId) {
        return new ResponseEntity<>(notificationService.getAllNotifications(receiverId),
                                    HttpStatus.ACCEPTED);
    }

    // Endpoint to delete a notification
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteNotification(@RequestParam Long notificationId) {
        return new ResponseEntity<>(notificationService.deleteNotification(notificationId), HttpStatus.OK);
    }

    // Endpoint to flag a notification
    @PutMapping("/flag")
    public ResponseEntity<?> flagNotification(@RequestParam Long notificationId) {
        return new ResponseEntity<>(notificationService.flagNotification(notificationId), HttpStatus.OK);
    }

    // Endpoint to unflag a notification
    @PutMapping("/unflag")
    public ResponseEntity<?> unflagNotification(@RequestParam Long notificationId) {
        return new ResponseEntity<>(notificationService.unflagNotification(notificationId), HttpStatus.OK);
    }

    // Endpoint to mark a notification as read
    @PutMapping("/mark-as-read")
    public ResponseEntity<?> markAsRead(@RequestParam Long notificationId) {
        return new ResponseEntity<>(notificationService.markAsRead(notificationId),
                HttpStatus.ACCEPTED);
    }
}

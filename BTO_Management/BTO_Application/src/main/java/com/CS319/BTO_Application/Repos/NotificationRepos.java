package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepos extends JpaRepository<Notification, Long> {

    // Find notifications for a specific user (receiverName)
    List<Notification> findByReceiverNameAndIsRead(String receiverName, boolean isRead);

    // Find all notifications for a specific user, sorted by timestamp
    List<Notification> findByReceiverNameOrderByTimestampDesc(String receiverName);

    // Find all flagged notifications
    List<Notification> findByReceiverNameAndIsFlagged(String receiverName, boolean isFlagged);

}

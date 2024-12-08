package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepos extends JpaRepository<Notification, Long> {

    // Find notifications for a specific user (receiverID)
    List<Notification> findByReceiverIDAndIsRead(Long receiverID, boolean isRead);

    // Find all notifications for a specific user, sorted by timestamp
    List<Notification> findByReceiverIDOrderByTimestampDesc(Long receiverID);

    // Find all flagged notifications
    List<Notification> findByReceiverIDAndIsFlagged(Long receiverID, boolean isFlagged);

}

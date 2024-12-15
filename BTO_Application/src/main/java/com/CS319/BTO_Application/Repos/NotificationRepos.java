package com.CS319.BTO_Application.Repos;

import com.CS319.BTO_Application.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepos extends JpaRepository<Notification, Long> {

    // Find unread notifications for a specific user, sorted by timestamp (latest first)
    List<Notification> findByReceiverNameAndIsReadOrderByTimestampDesc(String receiverName, boolean isRead);

    // Find flagged notifications for a specific user, sorted by timestamp (latest first)
    List<Notification> findByReceiverNameAndIsFlaggedOrderByTimestampDesc(String receiverName, boolean isFlagged);

    // Find all notifications for a specific user, sorted by timestamp
    List<Notification> findByReceiverNameOrderByTimestampDesc(String receiverName);

}

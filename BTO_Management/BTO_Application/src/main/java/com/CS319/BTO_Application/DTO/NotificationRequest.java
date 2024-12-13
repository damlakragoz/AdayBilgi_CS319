package com.CS319.BTO_Application.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationRequest {
    private String notificationType;
    private Long receiverId;
}

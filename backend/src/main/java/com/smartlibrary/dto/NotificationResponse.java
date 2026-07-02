package com.smartlibrary.dto;

import com.smartlibrary.entity.Notification;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String title,
        String message,
        String type,
        boolean read,
        LocalDateTime createdAt
) {
    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isReadStatus(),
                notification.getCreatedAt()
        );
    }
}

package com.smartlibrary.controller;

import com.smartlibrary.dto.NotificationResponse;
import com.smartlibrary.entity.Notification;
import com.smartlibrary.entity.User;
import com.smartlibrary.repository.NotificationRepository;
import com.smartlibrary.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationController(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> list(@AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        boolean staff = user.getRole() != null && List.of("ADMIN", "LIBRARIAN").contains(user.getRole().getName());
        List<Notification> notifications = staff
                ? notificationRepository.findAll().stream()
                    .sorted(Comparator.comparing(Notification::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                    .toList()
                : notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(notifications.stream().map(NotificationResponse::from).toList());
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        notification.setReadStatus(true);
        return ResponseEntity.ok(NotificationResponse.from(notificationRepository.save(notification)));
    }
}

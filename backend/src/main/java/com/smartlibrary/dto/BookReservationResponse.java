package com.smartlibrary.dto;

import com.smartlibrary.entity.Reservation;

import java.time.LocalDateTime;

public record BookReservationResponse(
        Long id,
        Long bookId,
        String bookTitle,
        String userName,
        String status,
        LocalDateTime reservedAt,
        LocalDateTime expiresAt
) {
    public static BookReservationResponse from(Reservation reservation) {
        return new BookReservationResponse(
                reservation.getId(),
                reservation.getBook() != null ? reservation.getBook().getId() : null,
                reservation.getBook() != null ? reservation.getBook().getTitle() : "",
                reservation.getUser() != null ? reservation.getUser().getFullName() : "",
                reservation.getStatus(),
                reservation.getReservedAt(),
                reservation.getExpiresAt()
        );
    }
}

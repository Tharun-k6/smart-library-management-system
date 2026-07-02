package com.smartlibrary.dto;

import com.smartlibrary.entity.SeatReservation;

import java.time.LocalDateTime;

public record SeatReservationResponse(
        Long id,
        String seatNumber,
        String timeSlot,
        String status,
        String userName,
        LocalDateTime reservedAt
) {
    public static SeatReservationResponse from(SeatReservation reservation) {
        return new SeatReservationResponse(
                reservation.getId(),
                reservation.getSeatNumber(),
                reservation.getTimeSlot(),
                reservation.getStatus(),
                reservation.getUser() != null ? reservation.getUser().getFullName() : "",
                reservation.getReservedAt()
        );
    }
}

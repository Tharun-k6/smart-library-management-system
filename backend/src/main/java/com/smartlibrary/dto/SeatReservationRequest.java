package com.smartlibrary.dto;

import jakarta.validation.constraints.NotBlank;

public record SeatReservationRequest(
        @NotBlank String seatNumber,
        @NotBlank String timeSlot
) {
}

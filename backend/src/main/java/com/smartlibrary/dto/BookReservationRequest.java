package com.smartlibrary.dto;

import jakarta.validation.constraints.NotNull;

public record BookReservationRequest(
        @NotNull Long bookId
) {
}

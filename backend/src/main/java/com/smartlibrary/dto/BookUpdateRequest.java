package com.smartlibrary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record BookUpdateRequest(
        @NotBlank String title,
        String isbn,
        @NotNull Long authorId,
        @NotNull Long publisherId,
        @NotNull Long categoryId,
        String description,
        String coverImageUrl,
        Integer quantity,
        String shelfLocation,
        BigDecimal price,
        Boolean digitalAvailable
) {}

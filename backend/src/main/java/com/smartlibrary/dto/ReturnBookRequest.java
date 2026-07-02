package com.smartlibrary.dto;

import jakarta.validation.constraints.NotNull;

public record ReturnBookRequest(
        @NotNull Long issuedBookId
) {}

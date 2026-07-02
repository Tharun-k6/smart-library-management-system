package com.smartlibrary.dto;

public record UserProfileResponse(
        Long id,
        String fullName,
        String email,
        String role,
        boolean emailVerified,
        boolean otpVerified
) {}

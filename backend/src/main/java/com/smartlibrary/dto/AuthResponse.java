package com.smartlibrary.dto;

public record AuthResponse(
        String token,
        String tokenType,
        String role,
        String fullName,
        String email
) {}

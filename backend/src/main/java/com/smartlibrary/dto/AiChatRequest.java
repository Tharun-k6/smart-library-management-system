package com.smartlibrary.dto;

import jakarta.validation.constraints.NotBlank;

public record AiChatRequest(
        @NotBlank String prompt
) {
}

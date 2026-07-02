package com.smartlibrary.dto;

import java.util.List;

public record AiChatResponse(
        String answer,
        List<String> suggestions
) {
}

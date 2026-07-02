package com.smartlibrary.dto;

import jakarta.validation.constraints.NotNull;

public record IssueBookRequest(
        @NotNull Long userId,
        @NotNull Long bookCopyId
) {}

package com.smartlibrary.dto;

import java.util.List;

public record DashboardStatsResponse(
        long totalBooks,
        long availableBooks,
        long issuedBooks,
        long reservedBooks,
        long activeUsers,
        long overdueBooks,
        double totalFines,
        long readingHallOccupancy,
        List<ChartPoint> monthlyIssues,
        List<ChartPoint> monthlyReturns,
        List<ChartPoint> fineCollection
) {
    public record ChartPoint(String label, double value) {}
}

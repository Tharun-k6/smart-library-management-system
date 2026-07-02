package com.smartlibrary.controller;

import com.smartlibrary.dto.DashboardStatsResponse;
import com.smartlibrary.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final DashboardService dashboardService;

    public AnalyticsController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardStatsResponse> analytics() {
        return ResponseEntity.ok(dashboardService.getStats());
    }
}

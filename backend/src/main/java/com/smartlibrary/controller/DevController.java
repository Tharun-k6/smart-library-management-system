package com.smartlibrary.controller;

import com.smartlibrary.config.DataSeeder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/dev")
public class DevController {

    private final DataSeeder dataSeeder;

    @Value("${spring.profiles.active:}")
    private String activeProfile;

    public DevController(DataSeeder dataSeeder) {
        this.dataSeeder = dataSeeder;
    }

    // Only enable in non-production (dev/test) environments
    @PostMapping("/reseed")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> reseed() {
        if (activeProfile != null && activeProfile.equalsIgnoreCase("prod")) {
            return ResponseEntity.status(403).body("Reseed not allowed in production");
        }
        dataSeeder.seed();
        return ResponseEntity.ok("Reseed completed");
    }
}

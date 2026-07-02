package com.smartlibrary.controller;

import com.smartlibrary.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @GetMapping
    public ResponseEntity<ApiResponse> list() {
        return ResponseEntity.ok(ApiResponse.ok("Payment module is ready"));
    }
}

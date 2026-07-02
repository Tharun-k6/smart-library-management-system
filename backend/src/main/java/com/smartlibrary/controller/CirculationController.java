package com.smartlibrary.controller;

import com.smartlibrary.dto.IssueBookRequest;
import com.smartlibrary.dto.ReturnBookRequest;
import com.smartlibrary.entity.IssuedBook;
import com.smartlibrary.service.CirculationService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/circulation")
@CrossOrigin(origins = "*")
public class CirculationController {

    private final CirculationService circulationService;

    public CirculationController(CirculationService circulationService) {
        this.circulationService = circulationService;
    }

    @PostMapping("/issue")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<IssuedBook> issue(@Valid @RequestBody IssueBookRequest request) {
        return ResponseEntity.ok(circulationService.issue(request));
    }

    @PostMapping("/return")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<IssuedBook> returnBook(@Valid @RequestBody ReturnBookRequest request) {
        return ResponseEntity.ok(circulationService.returnBook(request));
    }
}

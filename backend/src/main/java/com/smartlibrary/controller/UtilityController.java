package com.smartlibrary.controller;

import com.smartlibrary.entity.Book;
import com.smartlibrary.service.QRCodeService;
import com.smartlibrary.service.RecommendationService;
import com.smartlibrary.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/util")
@CrossOrigin(origins = "*")
public class UtilityController {

    private final QRCodeService qrCodeService;
    private final ReportService reportService;
    private final RecommendationService recommendationService;

    public UtilityController(QRCodeService qrCodeService, ReportService reportService, RecommendationService recommendationService) {
        this.qrCodeService = qrCodeService;
        this.reportService = reportService;
        this.recommendationService = recommendationService;
    }

    @GetMapping("/qr")
    public ResponseEntity<String> generateQr(@RequestParam String content) {
        return ResponseEntity.ok(qrCodeService.generateBase64QrCode(content));
    }

    @GetMapping(value = "/reports/books.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> booksPdf() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=book-report.pdf")
                .body(reportService.generateBooksPdf());
    }

    @GetMapping(value = "/reports/books.xlsx", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> booksExcel() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=book-report.xlsx")
                .body(reportService.generateBooksExcel());
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<Book>> recommendations(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(recommendationService.recommendForUser(userId));
    }
}

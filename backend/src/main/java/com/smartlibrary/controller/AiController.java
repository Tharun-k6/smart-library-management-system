package com.smartlibrary.controller;

import com.smartlibrary.dto.AiChatRequest;
import com.smartlibrary.dto.AiChatResponse;
import com.smartlibrary.entity.Book;
import com.smartlibrary.repository.BookRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final BookRepository bookRepository;

    public AiController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @GetMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestParam String prompt) {
        return ResponseEntity.ok(answer(prompt));
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chatPost(@Valid @RequestBody AiChatRequest request) {
        return ResponseEntity.ok(answer(request.prompt()));
    }

    private AiChatResponse answer(String prompt) {
        String value = prompt == null ? "" : prompt.toLowerCase(Locale.ROOT);
        List<Book> books = bookRepository.findAllWithRelations();
        List<String> titles = books.stream().limit(5).map(Book::getTitle).toList();

        if (value.contains("recommend") || value.contains("suggest") || value.contains("ai") || value.contains("machine")) {
            List<String> recommendations = books.stream()
                    .filter(book -> book.getCategory() != null && book.getCategory().getName().toLowerCase(Locale.ROOT).contains("data"))
                    .map(Book::getTitle)
                    .limit(4)
                    .toList();
            return new AiChatResponse("Based on the current catalog, start with these titles for AI and technical learning.", recommendations.isEmpty() ? titles : recommendations);
        }

        if (value.contains("reserve") || value.contains("seat")) {
            return new AiChatResponse("You can reserve reading hall seats from the Reservations page. Choose a seat, select a time slot, and submit the request.", List.of("Open Reservations", "Check available seats", "Review notifications"));
        }

        if (value.contains("fine") || value.contains("return") || value.contains("due")) {
            return new AiChatResponse("For fines or due dates, check Notifications and Reports. Staff can use circulation tools to issue or return books.", List.of("Open Notifications", "Download reports", "Ask librarian for renewal"));
        }

        return new AiChatResponse("I can help with catalog search, recommendations, reservations, due dates, and library workflow questions.", titles);
    }
}

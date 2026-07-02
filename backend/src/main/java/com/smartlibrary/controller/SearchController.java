package com.smartlibrary.controller;

import com.smartlibrary.entity.Book;
import com.smartlibrary.repository.BookRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final BookRepository bookRepository;

    public SearchController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @GetMapping
    public ResponseEntity<List<Book>> search(@RequestParam(required = false) String q) {
        List<Book> books = bookRepository.findAll();
        if (q == null || q.isBlank()) {
            return ResponseEntity.ok(books);
        }
        String query = q.toLowerCase();
        return ResponseEntity.ok(books.stream()
                .filter(book -> (book.getTitle() != null && book.getTitle().toLowerCase().contains(query))
                        || (book.getIsbn() != null && book.getIsbn().toLowerCase().contains(query))
                        || (book.getAuthor() != null && book.getAuthor().getName() != null && book.getAuthor().getName().toLowerCase().contains(query))
                        || (book.getCategory() != null && book.getCategory().getName() != null && book.getCategory().getName().toLowerCase().contains(query)))
                .toList());
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> suggestions(@RequestParam(required = false) String q) {
        String query = q == null ? "" : q.toLowerCase();
        List<String> suggestions = bookRepository.findAll().stream()
                .flatMap(book -> java.util.stream.Stream.of(book.getTitle(), book.getIsbn(), book.getAuthor() != null ? book.getAuthor().getName() : null, book.getCategory() != null ? book.getCategory().getName() : null))
                .filter(value -> value != null && !value.isBlank())
                .filter(value -> query.isBlank() || value.toLowerCase().contains(query))
                .distinct()
                .sorted(Comparator.naturalOrder())
                .limit(8)
                .collect(Collectors.toList());
        return ResponseEntity.ok(suggestions);
    }
}

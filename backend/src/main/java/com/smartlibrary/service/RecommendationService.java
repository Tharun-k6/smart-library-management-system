package com.smartlibrary.service;

import com.smartlibrary.entity.Book;
import com.smartlibrary.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class RecommendationService {

    private final BookRepository bookRepository;

    public RecommendationService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> recommendForUser(Long userId) {
        return bookRepository.findAll().stream()
                .sorted(Comparator.comparing(Book::getAvailableCopies, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(6)
                .toList();
    }
}

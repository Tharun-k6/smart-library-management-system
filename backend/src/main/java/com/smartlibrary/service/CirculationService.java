package com.smartlibrary.service;

import com.smartlibrary.dto.IssueBookRequest;
import com.smartlibrary.dto.ReturnBookRequest;
import com.smartlibrary.entity.BookCopy;
import com.smartlibrary.entity.IssuedBook;
import com.smartlibrary.entity.User;
import com.smartlibrary.repository.BookCopyRepository;
import com.smartlibrary.repository.IssuedBookRepository;
import com.smartlibrary.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class CirculationService {

    private final IssuedBookRepository issuedBookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final UserRepository userRepository;

    public CirculationService(IssuedBookRepository issuedBookRepository, BookCopyRepository bookCopyRepository, UserRepository userRepository) {
        this.issuedBookRepository = issuedBookRepository;
        this.bookCopyRepository = bookCopyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public IssuedBook issue(IssueBookRequest request) {
        User user = userRepository.findById(request.userId()).orElseThrow(() -> new IllegalArgumentException("User not found"));
        BookCopy bookCopy = bookCopyRepository.findById(request.bookCopyId()).orElseThrow(() -> new IllegalArgumentException("Book copy not found"));
        if (bookCopy.getStatus() != null && !bookCopy.getStatus().equalsIgnoreCase("AVAILABLE")) {
            throw new IllegalArgumentException("Book copy is not available");
        }

        bookCopy.setStatus("ISSUED");
        bookCopyRepository.save(bookCopy);

        IssuedBook issuedBook = IssuedBook.builder()
                .user(user)
                .bookCopy(bookCopy)
                .issueDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(14))
                .fineAmount(0.0)
                .status("ISSUED")
                .build();
        return issuedBookRepository.save(issuedBook);
    }

    @Transactional
    public IssuedBook returnBook(ReturnBookRequest request) {
        IssuedBook issuedBook = issuedBookRepository.findById(request.issuedBookId())
                .orElseThrow(() -> new IllegalArgumentException("Issued book not found"));
        if (issuedBook.getReturnDate() != null) {
            throw new IllegalArgumentException("Book already returned");
        }

        issuedBook.setReturnDate(LocalDate.now());
        issuedBook.setStatus("RETURNED");
        if (issuedBook.getBookCopy() != null) {
            BookCopy bookCopy = issuedBook.getBookCopy();
            bookCopy.setStatus("AVAILABLE");
            bookCopyRepository.save(bookCopy);
        }
        return issuedBookRepository.save(issuedBook);
    }
}

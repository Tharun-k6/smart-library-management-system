package com.smartlibrary.service;

import com.smartlibrary.dto.BookRequest;
import com.smartlibrary.entity.Book;
import com.smartlibrary.entity.Author;
import com.smartlibrary.entity.Category;
import com.smartlibrary.entity.Publisher;
import com.smartlibrary.repository.AuthorRepository;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.CategoryRepository;
import com.smartlibrary.repository.PublisherRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final CategoryRepository categoryRepository;

    public BookService(BookRepository bookRepository, AuthorRepository authorRepository, PublisherRepository publisherRepository, CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Book> findAll() {
        // use a fetch-join query to load related author/publisher/category to avoid lazy init errors during serialization
        return bookRepository.findAllWithRelations();
    }

    public Book findById(Long id) {
        return bookRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Book not found"));
    }

    public Book create(BookRequest request) {
        Author author = authorRepository.findById(request.authorId()).orElseThrow(() -> new IllegalArgumentException("Author not found"));
        Publisher publisher = publisherRepository.findById(request.publisherId()).orElseThrow(() -> new IllegalArgumentException("Publisher not found"));
        Category category = categoryRepository.findById(request.categoryId()).orElseThrow(() -> new IllegalArgumentException("Category not found"));
        Book book = Book.builder()
                .title(request.title())
                .isbn(request.isbn())
                .author(author)
                .publisher(publisher)
                .category(category)
                .description(request.description())
                .coverImageUrl(request.coverImageUrl())
                .quantity(request.quantity() == null ? 1 : request.quantity())
                .availableCopies(request.quantity() == null ? 1 : request.quantity())
                .shelfLocation(request.shelfLocation())
                .price(request.price())
                .digitalAvailable(request.digitalAvailable() != null && request.digitalAvailable())
                .build();
        return bookRepository.save(book);
    }

    public Book update(Long id, BookRequest request) {
        Book book = findById(id);
        Author author = authorRepository.findById(request.authorId()).orElseThrow(() -> new IllegalArgumentException("Author not found"));
        Publisher publisher = publisherRepository.findById(request.publisherId()).orElseThrow(() -> new IllegalArgumentException("Publisher not found"));
        Category category = categoryRepository.findById(request.categoryId()).orElseThrow(() -> new IllegalArgumentException("Category not found"));

        book.setTitle(request.title());
        book.setIsbn(request.isbn());
        book.setAuthor(author);
        book.setPublisher(publisher);
        book.setCategory(category);
        book.setDescription(request.description());
        book.setCoverImageUrl(request.coverImageUrl());
        book.setQuantity(request.quantity() == null ? book.getQuantity() : request.quantity());
        book.setAvailableCopies(request.quantity() == null ? book.getAvailableCopies() : request.quantity());
        book.setShelfLocation(request.shelfLocation());
        book.setPrice(request.price());
        book.setDigitalAvailable(request.digitalAvailable() != null && request.digitalAvailable());
        return bookRepository.save(book);
    }

    public void delete(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new IllegalArgumentException("Book not found");
        }
        bookRepository.deleteById(id);
    }
}

package com.smartlibrary.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(unique = true)
    private String isbn;

    @ManyToOne(fetch = FetchType.LAZY)
    private Author author;

    @ManyToOne(fetch = FetchType.LAZY)
    private Publisher publisher;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;

    @Column(length = 4000)
    private String description;

    private String coverImageUrl;
    private Integer quantity;
    private Integer availableCopies;
    private String shelfLocation;
    private BigDecimal price;
    @Builder.Default
    private Boolean digitalAvailable = false;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

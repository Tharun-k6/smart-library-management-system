package com.smartlibrary.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "book_copies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookCopy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Book book;

    @Column(nullable = false, unique = true)
    private String barcode;

    private String qrCodeValue;
    private String status;
    private String shelfLocation;
}

package com.smartlibrary.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "issued_books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssuedBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private BookCopy bookCopy;

    private LocalDate issueDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private Double fineAmount;
    private String status;
}

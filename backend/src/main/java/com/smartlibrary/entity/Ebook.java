package com.smartlibrary.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ebooks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ebook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Book book;

    private String fileName;
    private String fileUrl;
    private String accessLevel;
    private Long fileSize;
}

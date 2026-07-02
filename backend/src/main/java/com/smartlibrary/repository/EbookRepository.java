package com.smartlibrary.repository;

import com.smartlibrary.entity.Ebook;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EbookRepository extends JpaRepository<Ebook, Long> {
}

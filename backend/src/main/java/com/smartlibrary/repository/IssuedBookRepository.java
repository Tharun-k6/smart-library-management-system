package com.smartlibrary.repository;

import com.smartlibrary.entity.IssuedBook;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssuedBookRepository extends JpaRepository<IssuedBook, Long> {
}

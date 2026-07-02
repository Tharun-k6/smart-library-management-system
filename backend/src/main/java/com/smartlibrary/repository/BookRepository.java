package com.smartlibrary.repository;

import com.smartlibrary.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {

	@Query("select distinct b from Book b left join fetch b.author left join fetch b.publisher left join fetch b.category order by b.createdAt desc")
	List<Book> findAllWithRelations();

}

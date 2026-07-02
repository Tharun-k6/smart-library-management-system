package com.smartlibrary.repository;

import com.smartlibrary.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("select r from Reservation r left join fetch r.user left join fetch r.book order by r.reservedAt desc")
    List<Reservation> findAllWithRelations();

    @Query("select u.email from Reservation r join r.user u where r.id = :id")
    String findOwnerEmailById(Long id);

    boolean existsByUserIdAndBookId(Long userId, Long bookId);
}

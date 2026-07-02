package com.smartlibrary.repository;

import com.smartlibrary.entity.SeatReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SeatReservationRepository extends JpaRepository<SeatReservation, Long> {
    @Query("select r from SeatReservation r left join fetch r.user order by r.reservedAt desc")
    List<SeatReservation> findAllWithUser();

    @Query("select u.email from SeatReservation r join r.user u where r.id = :id")
    String findOwnerEmailById(Long id);

    boolean existsBySeatNumberIgnoreCaseAndTimeSlotIgnoreCase(String seatNumber, String timeSlot);
}

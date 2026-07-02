package com.smartlibrary.controller;

import com.smartlibrary.dto.BookReservationRequest;
import com.smartlibrary.dto.BookReservationResponse;
import com.smartlibrary.dto.SeatReservationRequest;
import com.smartlibrary.dto.SeatReservationResponse;
import com.smartlibrary.entity.Book;
import com.smartlibrary.entity.Reservation;
import com.smartlibrary.entity.SeatReservation;
import com.smartlibrary.entity.User;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.ReservationRepository;
import com.smartlibrary.repository.SeatReservationRepository;
import com.smartlibrary.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final SeatReservationRepository seatReservationRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public ReservationController(ReservationRepository reservationRepository,
                                 SeatReservationRepository seatReservationRepository,
                                 BookRepository bookRepository,
                                 UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.seatReservationRepository = seatReservationRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/books")
    public ResponseEntity<List<BookReservationResponse>> bookReservations() {
        return ResponseEntity.ok(reservationRepository.findAllWithRelations().stream()
                .map(BookReservationResponse::from)
                .toList());
    }

    @PostMapping("/books")
    public ResponseEntity<BookReservationResponse> reserveBook(@AuthenticationPrincipal UserDetails principal,
                                                               @Valid @RequestBody BookReservationRequest request) {
        User user = currentUser(principal);
        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));
        Reservation reservation = reservationRepository.save(Reservation.builder()
                .user(user)
                .book(book)
                .status("ACTIVE")
                .reservedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(3))
                .build());
        return ResponseEntity.ok(BookReservationResponse.from(reservation));
    }

    @PatchMapping("/books/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN') or authentication.name == @reservationSecurity.bookOwnerEmail(#id)")
    public ResponseEntity<BookReservationResponse> cancelBookReservation(@PathVariable Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        reservation.setStatus("CANCELLED");
        return ResponseEntity.ok(BookReservationResponse.from(reservationRepository.save(reservation)));
    }

    @GetMapping("/seats")
    public ResponseEntity<List<SeatReservationResponse>> seatReservations() {
        return ResponseEntity.ok(seatReservationRepository.findAllWithUser().stream()
                .map(SeatReservationResponse::from)
                .toList());
    }

    @PostMapping("/seats")
    public ResponseEntity<SeatReservationResponse> reserveSeat(@AuthenticationPrincipal UserDetails principal,
                                                               @Valid @RequestBody SeatReservationRequest request) {
        User user = currentUser(principal);
        boolean alreadyBooked = seatReservationRepository.findAll().stream()
                .anyMatch(reservation -> reservation.getSeatNumber().equalsIgnoreCase(request.seatNumber())
                        && reservation.getTimeSlot().equalsIgnoreCase(request.timeSlot())
                        && !"CANCELLED".equalsIgnoreCase(reservation.getStatus()));
        if (alreadyBooked) {
            throw new IllegalArgumentException("Seat is already reserved for that time slot");
        }

        SeatReservation reservation = seatReservationRepository.save(SeatReservation.builder()
                .user(user)
                .seatNumber(request.seatNumber())
                .timeSlot(request.timeSlot())
                .status("CONFIRMED")
                .reservedAt(LocalDateTime.now())
                .build());
        return ResponseEntity.ok(SeatReservationResponse.from(reservation));
    }

    @PatchMapping("/seats/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN') or authentication.name == @reservationSecurity.seatOwnerEmail(#id)")
    public ResponseEntity<SeatReservationResponse> cancelSeatReservation(@PathVariable Long id) {
        SeatReservation reservation = seatReservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Seat reservation not found"));
        reservation.setStatus("CANCELLED");
        return ResponseEntity.ok(SeatReservationResponse.from(seatReservationRepository.save(reservation)));
    }

    private User currentUser(UserDetails principal) {
        return userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}

package com.smartlibrary.config;

import com.smartlibrary.repository.ReservationRepository;
import com.smartlibrary.repository.SeatReservationRepository;
import org.springframework.stereotype.Component;

@Component("reservationSecurity")
public class ReservationSecurity {

    private final ReservationRepository reservationRepository;
    private final SeatReservationRepository seatReservationRepository;

    public ReservationSecurity(ReservationRepository reservationRepository, SeatReservationRepository seatReservationRepository) {
        this.reservationRepository = reservationRepository;
        this.seatReservationRepository = seatReservationRepository;
    }

    public String bookOwnerEmail(Long id) {
        String email = reservationRepository.findOwnerEmailById(id);
        return email == null ? "" : email;
    }

    public String seatOwnerEmail(Long id) {
        String email = seatReservationRepository.findOwnerEmailById(id);
        return email == null ? "" : email;
    }
}

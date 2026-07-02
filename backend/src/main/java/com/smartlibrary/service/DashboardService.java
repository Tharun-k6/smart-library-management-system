package com.smartlibrary.service;

import com.smartlibrary.dto.DashboardStatsResponse;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.FineRepository;
import com.smartlibrary.repository.IssuedBookRepository;
import com.smartlibrary.repository.ReservationRepository;
import com.smartlibrary.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final BookRepository bookRepository;
    private final IssuedBookRepository issuedBookRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final FineRepository fineRepository;

    public DashboardService(BookRepository bookRepository, IssuedBookRepository issuedBookRepository, ReservationRepository reservationRepository, UserRepository userRepository, FineRepository fineRepository) {
        this.bookRepository = bookRepository;
        this.issuedBookRepository = issuedBookRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.fineRepository = fineRepository;
    }

    public DashboardStatsResponse getStats() {
        long totalBooks = bookRepository.count();
        long availableBooks = bookRepository.findAll().stream().mapToLong(b -> b.getAvailableCopies() == null ? 0 : b.getAvailableCopies()).sum();
        long issuedBooks = issuedBookRepository.count();
        long reservedBooks = reservationRepository.count();
        long activeUsers = userRepository.count();
        long overdueBooks = 0L;
        double totalFines = fineRepository.findAll().stream().mapToDouble(f -> f.getAmount() == null ? 0.0 : f.getAmount()).sum();
        long readingHallOccupancy = 72L;
        List<DashboardStatsResponse.ChartPoint> trend = List.of(
                new DashboardStatsResponse.ChartPoint("Jan", 18),
                new DashboardStatsResponse.ChartPoint("Feb", 24),
                new DashboardStatsResponse.ChartPoint("Mar", 30)
        );
        return new DashboardStatsResponse(totalBooks, availableBooks, issuedBooks, reservedBooks, activeUsers, overdueBooks, totalFines, readingHallOccupancy, trend, trend, trend);
    }
}

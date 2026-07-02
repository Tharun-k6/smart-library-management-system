package com.smartlibrary.config;

import com.smartlibrary.entity.Role;
import com.smartlibrary.entity.User;
import com.smartlibrary.repository.RoleRepository;
import com.smartlibrary.repository.UserRepository;
import com.smartlibrary.repository.AuthorRepository;
import com.smartlibrary.repository.PublisherRepository;
import com.smartlibrary.repository.CategoryRepository;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.NotificationRepository;
import com.smartlibrary.repository.ReservationRepository;
import com.smartlibrary.repository.SeatReservationRepository;
import com.smartlibrary.entity.Author;
import com.smartlibrary.entity.Publisher;
import com.smartlibrary.entity.Category;
import com.smartlibrary.entity.Book;
import com.smartlibrary.entity.Notification;
import com.smartlibrary.entity.Reservation;
import com.smartlibrary.entity.SeatReservation;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final NotificationRepository notificationRepository;
    private final ReservationRepository reservationRepository;
    private final SeatReservationRepository seatReservationRepository;

    public DataSeeder(RoleRepository roleRepository,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      AuthorRepository authorRepository,
                      PublisherRepository publisherRepository,
                      CategoryRepository categoryRepository,
                      BookRepository bookRepository,
                      NotificationRepository notificationRepository,
                      ReservationRepository reservationRepository,
                      SeatReservationRepository seatReservationRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
        this.notificationRepository = notificationRepository;
        this.reservationRepository = reservationRepository;
        this.seatReservationRepository = seatReservationRepository;
    }

    @Override
    public void run(String... args) {
        // delegate to seed method so we can invoke it at runtime (dev reseed endpoint)
        seed();
    }

    // Public seed method so other components (eg. dev reseed controller) can re-run seeding without restarting
    public void seed() {
        Role admin = roleRepository.findByName("ADMIN").orElseGet(() -> roleRepository.save(Role.builder().name("ADMIN").build()));
        Role librarian = roleRepository.findByName("LIBRARIAN").orElseGet(() -> roleRepository.save(Role.builder().name("LIBRARIAN").build()));
        Role student = roleRepository.findByName("STUDENT").orElseGet(() -> roleRepository.save(Role.builder().name("STUDENT").build()));

        User adminUser = upsertUser("Admin User", "admin@smartlib.com", "Admin@123", admin);
        User librarianUser = upsertUser("Librarian User", "librarian@smartlib.com", "Librarian@123", librarian);
        User studentUser = upsertUser("Student User", "student@smartlib.com", "Student@123", student);

        // Seed demo authors, publishers, categories and books
        Author a1 = upsertAuthor("Francois Chollet", "Author of Deep Learning with Python and Keras.");
        Author a2 = upsertAuthor("Martin Kleppmann", "Author of Designing Data-Intensive Applications.");
        Author a3 = upsertAuthor("James Clear", "Author of Atomic Habits.");
        Author a4 = upsertAuthor("Robert C. Martin", "Software craftsmanship and architecture author.");
        Author a5 = upsertAuthor("Aurelien Geron", "Machine learning practitioner and educator.");
        Author a6 = upsertAuthor("Cal Newport", "Author focused on deep work and attention.");
        Author a7 = upsertAuthor("Gene Kim", "Technology leadership and DevOps author.");
        Author a8 = upsertAuthor("Don Norman", "Design and usability researcher.");
        Author a9 = upsertAuthor("Andrew Hunt", "Software engineering and pragmatic development author.");
        Author a10 = upsertAuthor("Eric Evans", "Domain-driven design pioneer.");
        Author a11 = upsertAuthor("John Doerr", "Author on goal setting and execution.");
        Author a12 = upsertAuthor("Jared Spool", "Researcher and author on product usability.");

        Publisher p1 = upsertPublisher("Manning Publications", "20 Baldwin Road");
        Publisher p2 = upsertPublisher("O'Reilly Media", "1005 Gravenstein Highway North");
        Publisher p3 = upsertPublisher("Random House", "1745 Broadway");
        Publisher p4 = upsertPublisher("Prentice Hall", "221 River Street");
        Publisher p5 = upsertPublisher("Pearson", "80 Strand");
        Publisher p6 = upsertPublisher("IT Revolution", "Portland");
        Publisher p7 = upsertPublisher("Basic Books", "New York");
        Publisher p8 = upsertPublisher("Addison-Wesley", "Boston");
        Publisher p9 = upsertPublisher("HarperBusiness", "New York");
        Publisher p10 = upsertPublisher("Rosenfeld Media", "Brooklyn");

        Category c1 = upsertCategory("Data Science", "Books on data science, ML and AI");
        Category c2 = upsertCategory("Systems", "Distributed systems and architecture");
        Category c3 = upsertCategory("Self-help", "Personal development books");
        Category c4 = upsertCategory("Software Engineering", "Clean code, architecture and engineering practices");
        Category c5 = upsertCategory("Product Design", "Design, usability and product thinking");
        Category c6 = upsertCategory("Operations", "IT operations, DevOps and service delivery");
        Category c7 = upsertCategory("Leadership", "Books on strategy, leadership and execution");
        Category c8 = upsertCategory("Algorithms", "Foundations of algorithms and problem solving");

        upsertBook("Deep Learning with Python", "9781617296864", a1, p1, c1,
            "A hands-on introduction to deep learning using Keras and Python.",
            "https://example.com/covers/deep-learning-python.jpg", 5, "A1-01", new BigDecimal("49.99"), false);

        Book b2 = upsertBook("Designing Data-Intensive Applications", "9781449373320", a2, p2, c2,
            "The big ideas behind reliable, scalable, and maintainable systems.",
            "https://example.com/covers/ddia.jpg", 3, "B2-10", new BigDecimal("59.99"), false);

        upsertBook("Atomic Habits", "9780735211292", a3, p3, c3,
            "An easy & proven way to build good habits and break bad ones.",
            "https://example.com/covers/atomic-habits.jpg", 8, "C3-05", new BigDecimal("19.99"), true);

        upsertBook("Clean Architecture", "9780134494166", a4, p4, c4,
            "A practical guide to software structure, boundaries, and maintainability.",
            "https://example.com/covers/clean-architecture.jpg", 6, "D1-02", new BigDecimal("44.99"), true);

        Book b5 = upsertBook("Hands-On Machine Learning", "9781098125974", a5, p2, c1,
            "Applied machine learning with Scikit-Learn, Keras, and TensorFlow.",
            "https://example.com/covers/hands-on-ml.jpg", 4, "A1-04", new BigDecimal("64.99"), true);

        upsertBook("Deep Work", "9781455586691", a6, p3, c3,
            "Rules for focused success in a distracted world.",
            "https://example.com/covers/deep-work.jpg", 7, "C2-07", new BigDecimal("24.99"), true);

        upsertBook("The Phoenix Project", "9780988262591", a7, p6, c6,
            "A novel about IT, DevOps, and helping your business win.",
            "https://example.com/covers/phoenix-project.jpg", 5, "E3-01", new BigDecimal("29.99"), false);

        upsertBook("The Design of Everyday Things", "9780465050659", a8, p7, c5,
            "A classic introduction to human-centered design and usability.",
            "https://example.com/covers/design-everyday-things.jpg", 6, "F1-09", new BigDecimal("22.99"), true);

        upsertBook("The Pragmatic Programmer", "9780135957059", a9, p8, c4,
            "A modern classic for practical software craftsmanship and everyday engineering.",
            "https://example.com/covers/pragmatic-programmer.jpg", 7, "D2-04", new BigDecimal("42.99"), true);

        upsertBook("Domain-Driven Design", "9780321125217", a10, p8, c4,
            "Strategic design guidance for complex business software systems.",
            "https://example.com/covers/domain-driven-design.jpg", 4, "D3-08", new BigDecimal("54.99"), false);

        upsertBook("Measure What Matters", "9780525536222", a11, p9, c7,
            "A leadership guide to building stronger goals, execution, and accountability.",
            "https://example.com/covers/measure-what-matters.jpg", 5, "G1-02", new BigDecimal("27.99"), true);

        upsertBook("Rocket Surgery Made Easy", "9780321657299", a12, p10, c5,
            "A practical handbook for usability testing and better product decisions.",
            "https://example.com/covers/rocket-surgery-made-easy.jpg", 3, "F2-01", new BigDecimal("21.99"), true);

        upsertBook("Grokking Algorithms", "9781617292231", a9, p1, c8,
            "An approachable visual guide to algorithms for modern learners.",
            "https://example.com/covers/grokking-algorithms.jpg", 8, "H1-06", new BigDecimal("39.99"), true);

        upsertNotification(studentUser, "Reservation confirmed", "Your seat A-12 reservation is confirmed for 10:00 AM - 12:00 PM.", "RESERVATION", false);
        upsertNotification(studentUser, "Recommended reading", "New AI and software engineering titles were added to the catalog.", "RECOMMENDATION", false);
        upsertNotification(librarianUser, "Catalog ready", "Seeded demo catalog now includes eight curated titles.", "SYSTEM", false);
        upsertNotification(adminUser, "Security review", "Role-based permissions are active for catalog, circulation, and dev tools.", "SECURITY", false);

        upsertSeatReservation(studentUser, "A-12", "10:00 AM - 12:00 PM", "CONFIRMED");
        upsertSeatReservation(librarianUser, "B-03", "01:00 PM - 03:00 PM", "HELD");
        upsertBookReservation(studentUser, b2, "ACTIVE");
        upsertBookReservation(studentUser, b5, "ACTIVE");
    }

    private Author upsertAuthor(String name, String bio) {
        return authorRepository.findAll().stream().filter(a -> a.getName().equalsIgnoreCase(name)).findFirst()
            .orElseGet(() -> authorRepository.save(Author.builder().name(name).biography(bio).build()));
    }

    private Publisher upsertPublisher(String name, String address) {
        return publisherRepository.findAll().stream().filter(p -> p.getName().equalsIgnoreCase(name)).findFirst()
            .orElseGet(() -> publisherRepository.save(Publisher.builder().name(name).address(address).build()));
    }

    private Category upsertCategory(String name, String desc) {
        return categoryRepository.findAll().stream().filter(c -> c.getName().equalsIgnoreCase(name)).findFirst()
            .orElseGet(() -> categoryRepository.save(Category.builder().name(name).description(desc).build()));
    }

    private Book upsertBook(String title, String isbn, Author author, Publisher publisher, Category category,
                    String description, String coverUrl, int qty, String shelf, BigDecimal price, boolean digital) {
        Book book = bookRepository.findAll().stream().filter(b -> isbn != null && isbn.equals(b.getIsbn())).findFirst().orElseGet(Book::new);
        book.setTitle(title);
        book.setIsbn(isbn);
        book.setAuthor(author);
        book.setPublisher(publisher);
        book.setCategory(category);
        book.setDescription(description);
        book.setCoverImageUrl(coverUrl);
        book.setQuantity(qty);
        book.setAvailableCopies(qty);
        book.setShelfLocation(shelf);
        book.setPrice(price);
        book.setDigitalAvailable(digital);
        return bookRepository.save(book);
        }

    private void upsertNotification(User user, String title, String message, String type, boolean read) {
        boolean exists = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .anyMatch(notification -> notification.getTitle().equalsIgnoreCase(title));
        if (!exists) {
            notificationRepository.save(Notification.builder()
                    .user(user)
                    .title(title)
                    .message(message)
                    .type(type)
                    .readStatus(read)
                    .createdAt(LocalDateTime.now())
                    .build());
    }
    }

    private void upsertSeatReservation(User user, String seatNumber, String timeSlot, String status) {
        boolean exists = seatReservationRepository.existsBySeatNumberIgnoreCaseAndTimeSlotIgnoreCase(seatNumber, timeSlot);
        if (!exists) {
            seatReservationRepository.save(SeatReservation.builder()
                    .user(user)
                    .seatNumber(seatNumber)
                    .timeSlot(timeSlot)
                    .status(status)
                    .reservedAt(LocalDateTime.now())
                    .build());
        }
    }

    private void upsertBookReservation(User user, Book book, String status) {
        boolean exists = reservationRepository.existsByUserIdAndBookId(user.getId(), book.getId());
        if (!exists) {
            reservationRepository.save(Reservation.builder()
                    .user(user)
                    .book(book)
                    .reservedAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusDays(3))
                    .status(status)
                    .build());
        }
    }

    private User upsertUser(String fullName, String email, String password, Role role) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setEnabled(true);
        user.setEmailVerified(true);
        user.setOtpVerified(true);
        return userRepository.save(user);
    }
}

package com.smartlibrary.service;

import com.smartlibrary.dto.AuthResponse;
import com.smartlibrary.dto.LoginRequest;
import com.smartlibrary.dto.RegisterRequest;
import com.smartlibrary.entity.Role;
import com.smartlibrary.entity.User;
import com.smartlibrary.repository.RoleRepository;
import com.smartlibrary.repository.UserRepository;
import com.smartlibrary.util.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }
        validatePassword(request.password());
        Role role = roleRepository.findByName(request.role().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid role"));
        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(role)
                .enabled(true)
                .emailVerified(false)
                .otpVerified(false)
                .build();
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, "Bearer", role.getName(), user.getFullName(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setLastLoginAt(java.time.LocalDateTime.now());
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, "Bearer", user.getRole().getName(), user.getFullName(), user.getEmail());
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLower = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        boolean hasSymbol = password.chars().anyMatch(ch -> !Character.isLetterOrDigit(ch));
        if (!hasUpper || !hasLower || !hasDigit || !hasSymbol) {
            throw new IllegalArgumentException("Password must include uppercase, lowercase, number, and symbol characters");
        }
    }
}

package com.baka.eshop.auth.service;

import com.baka.eshop.auth.dto.*;
import com.baka.eshop.domain.entity.*;
import com.baka.eshop.repository.UserRepository;
import com.baka.eshop.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(CONFLICT, "Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setMotDePasse(passwordEncoder.encode(request.getPassword()));
        user.setPrenom(request.getPrenom());
        user.setNom(request.getNom());
        user.setRole(RoleEnum.CUSTOMER);
        user.setActif(ActifEnum.ACTIVE);
        user.setDateCreation(Instant.now());

        userRepository.save(user);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Invalid credentials"));

        if (user.getActif() != ActifEnum.ACTIVE) {
            throw new ResponseStatusException(UNAUTHORIZED, "Account is disabled");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getMotDePasse())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getPrenom(), user.getNom(), user.getRole().name());
    }
}

package com.baka.eshop.auth.service;

import com.baka.eshop.auth.dto.*;
import com.baka.eshop.domain.entity.*;
import com.baka.eshop.repository.UserRepository;
import com.baka.eshop.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(RegisterRequest request) {
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

        User user = userRepository.findAll()
                .stream()
                .filter(u -> u.getEmail().equals(request.getEmail()))
                .findFirst()
                .orElseThrow();

        if (!passwordEncoder.matches(request.getPassword(), user.getMotDePasse())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token);
    }
}
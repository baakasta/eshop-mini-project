package com.baka.eshop.service;

import com.baka.eshop.domain.entity.*;
import com.baka.eshop.dto.*;
import com.baka.eshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public UserResponse getProfile(String email) {
        return toResponse(userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found")));
    }

    public UserResponse updateProfile(String email, String prenom, String nom) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        user.setPrenom(prenom);
        user.setNom(nom);
        return toResponse(userRepository.save(user));
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public UserResponse toggleUserStatus(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        user.setActif(user.getActif() == ActifEnum.ACTIVE ? ActifEnum.DELETED : ActifEnum.ACTIVE);
        return toResponse(userRepository.save(user));
    }

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalProducts(productRepository.count());
        stats.setTotalOrders(orderRepository.count());
        stats.setTotalRevenue(orderRepository.findAll().stream().mapToDouble(Order::getTotalTTC).sum());
        stats.setPendingOrders(orderRepository.findAll().stream()
                .filter(o -> o.getStatut() == OrderStatus.EN_ATTENTE).count());
        stats.setActiveProducts(productRepository.findByActifTrue().size());
        return stats;
    }

    private UserResponse toResponse(User u) {
        UserResponse r = new UserResponse();
        r.setId(u.getId());
        r.setEmail(u.getEmail());
        r.setPrenom(u.getPrenom());
        r.setNom(u.getNom());
        r.setRole(u.getRole().name());
        r.setActif(u.getActif().name());
        r.setDateCreation(u.getDateCreation());
        return r;
    }
}

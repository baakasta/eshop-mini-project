package com.baka.eshop.controller;

import com.baka.eshop.dto.*;
import com.baka.eshop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getProfile(Authentication auth) {
        return userService.getProfile(auth.getName());
    }

    @PutMapping("/me")
    public UserResponse updateProfile(Authentication auth, @RequestBody Map<String, String> body) {
        return userService.updateProfile(auth.getName(), body.get("prenom"), body.get("nom"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse toggleStatus(@PathVariable UUID id) {
        return userService.toggleUserStatus(id);
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardStats getDashboard() {
        return userService.getDashboardStats();
    }
}

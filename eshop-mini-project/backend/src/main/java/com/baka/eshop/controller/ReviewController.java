package com.baka.eshop.controller;

import com.baka.eshop.dto.*;
import com.baka.eshop.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public List<ReviewResponse> getProductReviews(@PathVariable UUID productId) {
        return reviewService.getProductReviews(productId);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ReviewResponse> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @PostMapping
    public ReviewResponse create(@Valid @RequestBody ReviewRequest request, Authentication auth) {
        return reviewService.createReview(request, auth.getName());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ReviewResponse approve(@PathVariable UUID id) {
        return reviewService.approveReview(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable UUID id) {
        reviewService.deleteReview(id);
    }
}

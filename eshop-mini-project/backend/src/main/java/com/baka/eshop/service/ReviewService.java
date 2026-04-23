package com.baka.eshop.service;

import com.baka.eshop.domain.entity.*;
import com.baka.eshop.dto.*;
import com.baka.eshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<ReviewResponse> getProductReviews(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found"));
        return reviewRepository.findByProductAndApprouveTrue(product).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public ReviewResponse createReview(ReviewRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found"));
        Review review = new Review();
        review.setCustomer(user);
        review.setProduct(product);
        review.setNote(request.getNote());
        review.setCommentaire(request.getCommentaire());
        review.setDateCreation(Instant.now());
        review.setApprouve(false);
        return toResponse(reviewRepository.save(review));
    }

    public ReviewResponse approveReview(UUID id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Review not found"));
        review.setApprouve(true);
        return toResponse(reviewRepository.save(review));
    }

    public void deleteReview(UUID id) { reviewRepository.deleteById(id); }

    private ReviewResponse toResponse(Review r) {
        ReviewResponse res = new ReviewResponse();
        res.setId(r.getId());
        res.setCustomerName(r.getCustomer().getPrenom() + " " + r.getCustomer().getNom());
        res.setCustomerId(r.getCustomer().getId());
        res.setProductId(r.getProduct().getId());
        res.setProductNom(r.getProduct().getNom());
        res.setNote(r.getNote());
        res.setCommentaire(r.getCommentaire());
        res.setDateCreation(r.getDateCreation());
        res.setApprouve(r.isApprouve());
        return res;
    }
}

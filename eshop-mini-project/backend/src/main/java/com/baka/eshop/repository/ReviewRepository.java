package com.baka.eshop.repository;

import com.baka.eshop.domain.entity.Product;
import com.baka.eshop.domain.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByProduct(Product product);
    List<Review> findByProductAndApprouveTrue(Product product);
}

package com.baka.eshop.repository;

import com.baka.eshop.domain.entity.Product;
import com.baka.eshop.domain.entity.SellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByActifTrue();
    List<Product> findBySeller(SellerProfile seller);
    List<Product> findByNomContainingIgnoreCase(String nom);
}

package com.baka.eshop.repository;

import com.baka.eshop.domain.entity.SellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SellerProfileRepository extends JpaRepository<SellerProfile, UUID> {

}

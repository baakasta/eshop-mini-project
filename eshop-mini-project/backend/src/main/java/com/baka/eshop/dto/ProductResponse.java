package com.baka.eshop.dto;

import lombok.Data;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
public class ProductResponse {
    private UUID id;
    private String nom;
    private String description;
    private double prix;
    private Double prixPromo;
    private int stock;
    private boolean actif;
    private Instant dateCreation;
    private List<String> images;
    private List<CategoryResponse> categories;
    private UUID sellerId;
    private String sellerName;
    private double averageRating;
    private int reviewCount;
    private List<VariantResponse> variants;
}

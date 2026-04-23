package com.baka.eshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
public class ProductRequest {
    @NotBlank
    private String nom;
    private String description;
    @NotNull @Min(0)
    private Double prix;
    private Double prixPromo;
    @Min(0)
    private int stock;
    private List<String> images;
    private Set<UUID> categoryIds;
}

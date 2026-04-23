package com.baka.eshop.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class CategoryResponse {
    private UUID id;
    private String nom;
    private String description;
    private UUID parentId;
    private String parentNom;
    private List<CategoryResponse> children;
}

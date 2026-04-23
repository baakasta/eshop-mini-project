package com.baka.eshop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.UUID;

@Data
public class CategoryRequest {
    @NotBlank
    private String nom;
    private String description;
    private UUID parentId;
}

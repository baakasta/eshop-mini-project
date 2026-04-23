package com.baka.eshop.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class ReviewRequest {
    @NotNull
    private UUID productId;
    @Min(1) @Max(5)
    private int note;
    private String commentaire;
}

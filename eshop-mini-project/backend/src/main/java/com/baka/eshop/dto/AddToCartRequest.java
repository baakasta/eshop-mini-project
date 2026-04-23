package com.baka.eshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class AddToCartRequest {
    @NotNull
    private UUID productId;
    private UUID variantId;
    @Min(1)
    private int quantite = 1;
}

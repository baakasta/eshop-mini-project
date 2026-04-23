package com.baka.eshop.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CartItemResponse {
    private UUID id;
    private UUID productId;
    private String productNom;
    private String productImage;
    private double prix;
    private int quantite;
    private UUID variantId;
    private String variantLabel;
}

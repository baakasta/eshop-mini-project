package com.baka.eshop.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class OrderItemResponse {
    private UUID id;
    private UUID productId;
    private String productNom;
    private String productImage;
    private int quantity;
    private double prixUnitaire;
    private String variantLabel;
}

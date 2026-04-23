package com.baka.eshop.dto;

import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
public class ReviewResponse {
    private UUID id;
    private String customerName;
    private UUID customerId;
    private UUID productId;
    private String productNom;
    private int note;
    private String commentaire;
    private Instant dateCreation;
    private boolean approuve;
}

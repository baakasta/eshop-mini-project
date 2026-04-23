package com.baka.eshop.dto;

import lombok.Data;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
public class OrderResponse {
    private UUID id;
    private String numeroCommande;
    private String statut;
    private double sousTotal;
    private double fraisLivraison;
    private double totalTTC;
    private Instant dateCommande;
    private AddressResponse addresse;
    private List<OrderItemResponse> lignes;
    private String customerName;
    private String customerEmail;
}

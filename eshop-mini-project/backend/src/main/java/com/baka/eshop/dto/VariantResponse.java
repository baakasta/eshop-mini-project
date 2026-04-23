package com.baka.eshop.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class VariantResponse {
    private UUID id;
    private String attribut;
    private String valeur;
    private int stockSupplementaire;
    private double prixDelta;
}

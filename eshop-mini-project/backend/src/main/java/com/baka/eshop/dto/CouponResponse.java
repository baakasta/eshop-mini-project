package com.baka.eshop.dto;

import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
public class CouponResponse {
    private UUID id;
    private String code;
    private String type;
    private double valeur;
    private Instant dateExpiration;
    private int usageMax;
    private int usageActuels;
    private String actif;
}

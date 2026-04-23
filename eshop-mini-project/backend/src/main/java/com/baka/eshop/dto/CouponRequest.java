package com.baka.eshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.Instant;

@Data
public class CouponRequest {
    @NotBlank
    private String code;
    @NotNull
    private String type;
    private double valeur;
    @NotNull
    private Instant dateExpiration;
    private int usageMax;
}

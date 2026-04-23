package com.baka.eshop.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class PlaceOrderRequest {
    @NotNull
    private UUID addressId;
    private String couponCode;
}

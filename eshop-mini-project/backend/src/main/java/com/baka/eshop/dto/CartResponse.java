package com.baka.eshop.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class CartResponse {
    private UUID id;
    private List<CartItemResponse> items;
    private double total;
    private int itemCount;
}

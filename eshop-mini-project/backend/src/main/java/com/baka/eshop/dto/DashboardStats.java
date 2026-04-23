package com.baka.eshop.dto;

import lombok.Data;

@Data
public class DashboardStats {
    private long totalUsers;
    private long totalProducts;
    private long totalOrders;
    private double totalRevenue;
    private long pendingOrders;
    private long activeProducts;
}

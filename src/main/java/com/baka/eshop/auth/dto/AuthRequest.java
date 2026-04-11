package com.baka.eshop.auth.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
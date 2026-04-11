package com.baka.eshop.auth.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String prenom;
    private String nom;
}
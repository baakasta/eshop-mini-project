package com.baka.eshop.auth.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String email;
    private String prenom;
    private String nom;
    private String role;

    public AuthResponse(String token, String email, String prenom, String nom, String role) {
        this.token = token;
        this.email = email;
        this.prenom = prenom;
        this.nom = nom;
        this.role = role;
    }
}

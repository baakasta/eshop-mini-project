package com.baka.eshop.dto;

import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
public class UserResponse {
    private UUID id;
    private String email;
    private String prenom;
    private String nom;
    private String role;
    private String actif;
    private Instant dateCreation;
}

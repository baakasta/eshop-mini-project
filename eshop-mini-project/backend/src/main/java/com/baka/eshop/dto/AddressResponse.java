package com.baka.eshop.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class AddressResponse {
    private UUID id;
    private String rue;
    private String ville;
    private String codePostal;
    private String pays;
    private boolean principal;
}

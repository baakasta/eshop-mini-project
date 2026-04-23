package com.baka.eshop.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name="addresses")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(name="address_id",nullable = false,updatable = false)
    private UUID id;

    @ManyToOne(optional=false,fetch = FetchType.LAZY)//to not load it untill its needed when object created
    @JoinColumn(name = "user_id",nullable=false)
    private User user;

    @Column(name="rue",nullable=false)
    private String rue;

    @Column(name="ville",nullable=false)
    private String ville;

    @Column(name="code_postal",nullable=false)
    private String codePostal;

    @Column(name="pays",nullable=false)
    private String pays;

    @Column(name="principal",nullable = false)
    private boolean principal;
}

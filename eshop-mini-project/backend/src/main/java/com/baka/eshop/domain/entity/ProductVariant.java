package com.baka.eshop.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="product_variant_id",nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name="attribut",nullable = false)
    private String attribut;

    @Column(name="valeur",nullable = false)
    private String valeur;

    @Column(name = "stock_supplementaire", nullable = false)
    private int stockSupplementaire;

    @Column(name = "prix_delta", nullable = false)
    private double prixDelta;
}
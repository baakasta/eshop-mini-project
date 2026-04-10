package com.baka.eshop.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem{
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(name="cart_item_id",nullable = false,updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name="cart_id",nullable = false,updatable = false)
    private Cart cart;

    @ManyToOne(fetch= FetchType.LAZY, optional = false)
    @JoinColumn(name="product_id",nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="product_variant_id")
    private ProductVariant variant;

    @Column(nullable = false)
    private int quantite;
}

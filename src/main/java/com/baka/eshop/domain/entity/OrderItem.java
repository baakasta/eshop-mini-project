package com.baka.eshop.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(name="order_item_id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch= FetchType.LAZY, optional = false)
    @JoinColumn(name="order_id", nullable=false, updatable=false)
    private Order order;

    @ManyToOne(fetch= FetchType.LAZY, optional = false)
    @JoinColumn(name="product_id", nullable=false)
    private Product product;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="product_variant_id")
    private ProductVariant variant;

    @Column(name="quantity", nullable=false)
    private int quantity;

    @Column(name="prix_unitaire", nullable=false)
    private double prixUnitaire;
}
package com.baka.eshop.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "order_id", nullable = false, updatable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false, updatable = false)
    private User customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private OrderStatus statut;

    @Column(name="numero_commande",nullable=false)
    private String numeroCommande;

    @OneToOne(fetch=FetchType.LAZY, optional = false)
    @JoinColumn(name="addresse_id", nullable=false)
    private Address addresse;

    @Column(name="sous_total")
    private double sousTotal;

    @Column(name="frais_livraison")
    private double fraisLivraison;

    @Column(name ="total_TTC")
    private double totalTTC;

    @Column(name="date_commande",nullable = false,updatable = false)
    private Instant dateCommande;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> lignes;
}





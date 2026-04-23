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
@Table(name = "carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cart {

    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    @Column(name="cart_id",nullable = false,updatable = false)
    private UUID id;

    @OneToOne(fetch=FetchType.LAZY, optional=false)
    @JoinColumn(name="user_id",nullable = false,updatable=false)
    private User customer;

    @OneToMany(mappedBy = "cart", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> lignes;

    @Column(name="date_modification",nullable = false)
    private Instant dateModification;

}

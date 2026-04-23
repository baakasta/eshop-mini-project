package com.baka.eshop.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(name="coupon_id",nullable = false,updatable = false)
    private UUID id;

    @Column(name="code",nullable=false,updatable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name="type",nullable = false)
    private CouponTypeEnum type;

    @Column(name="valeur",nullable = false)
    private double valeur;

    @Column(name="date_expiration",nullable=false,updatable=false)
    private Instant dateExpiration;

    @Column(name="usage_max",nullable = false)
    private int usageMax;

    @Column(name="usage_actuels")
    private int usageActuels;

    @Column(name="coupon_activity",nullable=false)
    private ActifEnum actif;

}

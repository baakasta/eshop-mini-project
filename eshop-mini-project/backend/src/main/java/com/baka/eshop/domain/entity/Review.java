package com.baka.eshop.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(name="review_id",nullable = false,updatable = false)
    private UUID id;

    @ManyToOne(fetch= FetchType.LAZY,optional = false)
    @JoinColumn(name="customer_id",nullable=false,updatable=false)
    private User customer;

    @ManyToOne(fetch=FetchType.LAZY,optional = false)
    @JoinColumn(name="product_id",nullable = false,updatable = false)
    private Product product;

    @Min(1)
    @Max(5)
    @Column(name="note", nullable = false)
    private int note;

    @Column(name="commentaire",length = 1000)
    private String commentaire;

    @Column(name="date_creation",nullable = false,updatable = false)
    private Instant dateCreation;

    @Column(name="approuve",nullable = false)
    private boolean approuve;
}

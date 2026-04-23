package com.baka.eshop.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

import java.util.UUID;

@Entity
@Table(name="seller_profiles")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SellerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="seller_id",nullable = false,updatable = false)
    private UUID id;


    @OneToOne(optional=false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",unique=true,nullable=false)
    private User user;

    @Column(name="nom_boutique",nullable=false)
    private String nomBoutique;

    @Column(name="description",length = 1000)
    private String description;

    @URL
    @Column(name="logo",nullable=false)
    private String logo;

    @Column(name="note")
    private double note;
}

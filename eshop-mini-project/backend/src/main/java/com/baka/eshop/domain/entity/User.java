package com.baka.eshop.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

import javax.annotation.processing.Generated;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    @Column(name="id",nullable = false,updatable = false)
    private UUID id;

    @Email
    @Column(name="email",nullable = false,unique = true,updatable = false)
    private String email;


    @Column(name="mot_de_passe",nullable = false)
    private String motDePasse;

    @Column(name="prenom",nullable = false)
    private String prenom;

    @Column(name="nom",nullable = false)
    private String nom;

    @Enumerated(EnumType.STRING)
    @Column(name="role",nullable = false,updatable = false)
    private RoleEnum role;

    @Enumerated(EnumType.STRING)
    @Column(name="actif",nullable = false)
    private ActifEnum actif;

    @Column(name ="date_creation",updatable = false,nullable = false)
    private Instant dateCreation;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private SellerProfile sellerProfile;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Address> addresses;

    @OneToOne(mappedBy = "customer")
    private Cart cart;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<Order> orders;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<Review> reviews;

}

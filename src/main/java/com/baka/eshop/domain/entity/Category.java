package com.baka.eshop.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

    @Entity
    @Table(name = "categories")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public class Category {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        @Column(name="category_id",nullable = false,updatable = false)
        private UUID id;

        @Column(name="nom",nullable = false)
        private String nom;

        @Column(length = 1000)
        private String description;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "parent_id")
        private Category parent;

        @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
        private List<Category> children;
    }


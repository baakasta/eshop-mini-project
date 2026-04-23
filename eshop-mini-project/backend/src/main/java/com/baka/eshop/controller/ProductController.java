package com.baka.eshop.controller;

import com.baka.eshop.dto.*;
import com.baka.eshop.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductResponse> getAll() {
        return productService.getAllProducts();
    }

    @GetMapping("/search")
    public List<ProductResponse> search(@RequestParam String q) {
        return productService.searchProducts(q);
    }

    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable UUID id) {
        return productService.getProductById(id);
    }

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public List<ProductResponse> getSellerProducts(Authentication auth) {
        return productService.getSellerProducts(auth.getName());
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ProductResponse> getAdminProducts() {
        return productService.getAllAdminProducts();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ProductResponse create(@Valid @RequestBody ProductRequest request, Authentication auth) {
        return productService.createProduct(request, auth.getName());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ProductResponse update(@PathVariable UUID id, @Valid @RequestBody ProductRequest request, Authentication auth) {
        return productService.updateProduct(id, request, auth.getName());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public void delete(@PathVariable UUID id, Authentication auth) {
        productService.deleteProduct(id, auth.getName());
    }
}

package com.baka.eshop.controller;

import com.baka.eshop.dto.*;
import com.baka.eshop.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getCart(Authentication auth) {
        return cartService.getCart(auth.getName());
    }

    @PostMapping
    public CartResponse addToCart(@Valid @RequestBody AddToCartRequest request, Authentication auth) {
        return cartService.addToCart(request, auth.getName());
    }

    @PutMapping("/{itemId}")
    public CartResponse updateItem(@PathVariable UUID itemId, @RequestParam int quantite, Authentication auth) {
        return cartService.updateCartItem(itemId, quantite, auth.getName());
    }

    @DeleteMapping("/{itemId}")
    public CartResponse removeItem(@PathVariable UUID itemId, Authentication auth) {
        return cartService.removeFromCart(itemId, auth.getName());
    }

    @DeleteMapping
    public void clearCart(Authentication auth) {
        cartService.clearCart(auth.getName());
    }
}

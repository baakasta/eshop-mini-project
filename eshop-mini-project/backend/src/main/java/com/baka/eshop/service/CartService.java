package com.baka.eshop.service;

import com.baka.eshop.domain.entity.*;
import com.baka.eshop.dto.*;
import com.baka.eshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;

    public CartResponse getCart(String email) {
        User user = getUser(email);
        Cart cart = cartRepository.findByCustomer(user)
                .orElseGet(() -> createCart(user));
        return toResponse(cart);
    }

    @Transactional
    public CartResponse addToCart(AddToCartRequest request, String email) {
        User user = getUser(email);
        Cart cart = cartRepository.findByCustomer(user)
                .orElseGet(() -> createCart(user));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found"));

        CartItem existingItem = cart.getLignes() != null ?
                cart.getLignes().stream()
                        .filter(i -> i.getProduct().getId().equals(request.getProductId()))
                        .findFirst().orElse(null) : null;

        if (existingItem != null) {
            existingItem.setQuantite(existingItem.getQuantite() + request.getQuantite());
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantite(request.getQuantite());
            if (request.getVariantId() != null) {
                ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                        .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Variant not found"));
                item.setVariant(variant);
            }
            if (cart.getLignes() == null) cart.setLignes(new ArrayList<>());
            cart.getLignes().add(item);
        }

        cart.setDateModification(Instant.now());
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateCartItem(UUID itemId, int quantite, String email) {
        User user = getUser(email);
        Cart cart = cartRepository.findByCustomer(user)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Cart not found"));

        CartItem item = cart.getLignes().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Item not found"));

        if (quantite <= 0) {
            cart.getLignes().remove(item);
        } else {
            item.setQuantite(quantite);
        }

        cart.setDateModification(Instant.now());
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeFromCart(UUID itemId, String email) {
        return updateCartItem(itemId, 0, email);
    }

    @Transactional
    public void clearCart(String email) {
        User user = getUser(email);
        Cart cart = cartRepository.findByCustomer(user).orElse(null);
        if (cart != null) {
            cart.getLignes().clear();
            cart.setDateModification(Instant.now());
            cartRepository.save(cart);
        }
    }

    private Cart createCart(User user) {
        Cart cart = new Cart();
        cart.setCustomer(user);
        cart.setDateModification(Instant.now());
        cart.setLignes(new ArrayList<>());
        return cartRepository.save(cart);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
    }

    private CartResponse toResponse(Cart cart) {
        CartResponse r = new CartResponse();
        r.setId(cart.getId());
        List<CartItemResponse> items = cart.getLignes() != null ?
                cart.getLignes().stream().map(this::toItemResponse).collect(Collectors.toList()) :
                List.of();
        r.setItems(items);
        r.setTotal(items.stream().mapToDouble(i -> i.getPrix() * i.getQuantite()).sum());
        r.setItemCount(items.stream().mapToInt(CartItemResponse::getQuantite).sum());
        return r;
    }

    private CartItemResponse toItemResponse(CartItem item) {
        CartItemResponse r = new CartItemResponse();
        r.setId(item.getId());
        r.setProductId(item.getProduct().getId());
        r.setProductNom(item.getProduct().getNom());
        r.setProductImage(item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()
                ? item.getProduct().getImages().get(0) : null);
        r.setPrix(item.getVariant() != null
                ? item.getProduct().getPrix() + item.getVariant().getPrixDelta()
                : item.getProduct().getPrixPromo() != null ? item.getProduct().getPrixPromo() : item.getProduct().getPrix());
        r.setQuantite(item.getQuantite());
        if (item.getVariant() != null) {
            r.setVariantId(item.getVariant().getId());
            r.setVariantLabel(item.getVariant().getAttribut() + ": " + item.getVariant().getValeur());
        }
        return r;
    }
}

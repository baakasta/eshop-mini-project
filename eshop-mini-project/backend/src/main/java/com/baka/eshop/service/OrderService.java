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
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;

    public List<OrderResponse> getMyOrders(String email) {
        User user = getUser(email);
        return orderRepository.findByCustomerOrderByDateCommandeDesc(user).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Order not found"));
        return toResponse(order);
    }

    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request, String email) {
        User user = getUser(email);
        Cart cart = cartRepository.findByCustomer(user)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "Cart is empty"));

        if (cart.getLignes() == null || cart.getLignes().isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "Cart is empty");
        }

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Address not found"));

        double sousTotal = 0;
        List<OrderItem> lignes = new ArrayList<>();

        for (CartItem ci : cart.getLignes()) {
            OrderItem oi = new OrderItem();
            oi.setProduct(ci.getProduct());
            oi.setVariant(ci.getVariant());
            oi.setQuantity(ci.getQuantite());
            double prix = ci.getVariant() != null
                    ? ci.getProduct().getPrix() + ci.getVariant().getPrixDelta()
                    : ci.getProduct().getPrixPromo() != null ? ci.getProduct().getPrixPromo() : ci.getProduct().getPrix();
            oi.setPrixUnitaire(prix);
            sousTotal += prix * ci.getQuantite();
            lignes.add(oi);
        }

        double discount = 0;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            Coupon coupon = couponRepository.findByCode(request.getCouponCode()).orElse(null);
            if (coupon != null && coupon.getActif() == ActifEnum.ACTIVE
                    && coupon.getDateExpiration().isAfter(Instant.now())
                    && coupon.getUsageActuels() < coupon.getUsageMax()) {
                if (coupon.getType() == CouponTypeEnum.PERCENT) {
                    discount = sousTotal * (coupon.getValeur() / 100.0);
                } else {
                    discount = coupon.getValeur();
                }
                coupon.setUsageActuels(coupon.getUsageActuels() + 1);
                couponRepository.save(coupon);
            }
        }

        double fraisLivraison = sousTotal > 5000 ? 0 : 500;
        double totalTTC = sousTotal - discount + fraisLivraison;

        Order order = new Order();
        order.setCustomer(user);
        order.setStatut(OrderStatus.EN_ATTENTE);
        order.setNumeroCommande("CMD-" + System.currentTimeMillis());
        order.setAddresse(address);
        order.setSousTotal(sousTotal);
        order.setFraisLivraison(fraisLivraison);
        order.setTotalTTC(totalTTC);
        order.setDateCommande(Instant.now());
        order.setLignes(lignes);

        for (OrderItem oi : lignes) {
            oi.setOrder(order);
        }

        Order saved = orderRepository.save(order);

        cart.getLignes().clear();
        cartRepository.save(cart);

        return toResponse(saved);
    }

    public OrderResponse updateOrderStatus(UUID id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Order not found"));
        order.setStatut(OrderStatus.valueOf(status));
        return toResponse(orderRepository.save(order));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
    }

    private OrderResponse toResponse(Order order) {
        OrderResponse r = new OrderResponse();
        r.setId(order.getId());
        r.setNumeroCommande(order.getNumeroCommande());
        r.setStatut(order.getStatut().name());
        r.setSousTotal(order.getSousTotal());
        r.setFraisLivraison(order.getFraisLivraison());
        r.setTotalTTC(order.getTotalTTC());
        r.setDateCommande(order.getDateCommande());
        r.setCustomerName(order.getCustomer().getPrenom() + " " + order.getCustomer().getNom());
        r.setCustomerEmail(order.getCustomer().getEmail());

        if (order.getAddresse() != null) {
            AddressResponse ar = new AddressResponse();
            ar.setId(order.getAddresse().getId());
            ar.setRue(order.getAddresse().getRue());
            ar.setVille(order.getAddresse().getVille());
            ar.setCodePostal(order.getAddresse().getCodePostal());
            ar.setPays(order.getAddresse().getPays());
            r.setAddresse(ar);
        }

        if (order.getLignes() != null) {
            r.setLignes(order.getLignes().stream().map(oi -> {
                OrderItemResponse ir = new OrderItemResponse();
                ir.setId(oi.getId());
                ir.setProductId(oi.getProduct().getId());
                ir.setProductNom(oi.getProduct().getNom());
                ir.setProductImage(oi.getProduct().getImages() != null && !oi.getProduct().getImages().isEmpty()
                        ? oi.getProduct().getImages().get(0) : null);
                ir.setQuantity(oi.getQuantity());
                ir.setPrixUnitaire(oi.getPrixUnitaire());
                if (oi.getVariant() != null) {
                    ir.setVariantLabel(oi.getVariant().getAttribut() + ": " + oi.getVariant().getValeur());
                }
                return ir;
            }).collect(Collectors.toList()));
        }

        return r;
    }
}

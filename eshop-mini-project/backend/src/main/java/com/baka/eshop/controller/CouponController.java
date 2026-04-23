package com.baka.eshop.controller;

import com.baka.eshop.dto.*;
import com.baka.eshop.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<CouponResponse> getAll() {
        return couponService.getAllCoupons();
    }

    @GetMapping("/validate")
    public CouponResponse validate(@RequestParam String code) {
        return couponService.validateCoupon(code);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public CouponResponse create(@Valid @RequestBody CouponRequest request) {
        return couponService.createCoupon(request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable UUID id) {
        couponService.deleteCoupon(id);
    }
}

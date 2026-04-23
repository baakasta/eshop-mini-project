package com.baka.eshop.service;

import com.baka.eshop.domain.entity.*;
import com.baka.eshop.dto.*;
import com.baka.eshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public List<CouponResponse> getAllCoupons() {
        return couponRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CouponResponse validateCoupon(String code) {
        Coupon c = couponRepository.findByCode(code)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Coupon not found"));
        return toResponse(c);
    }

    public CouponResponse createCoupon(CouponRequest req) {
        Coupon c = new Coupon();
        c.setCode(req.getCode().toUpperCase());
        c.setType(CouponTypeEnum.valueOf(req.getType()));
        c.setValeur(req.getValeur());
        c.setDateExpiration(req.getDateExpiration());
        c.setUsageMax(req.getUsageMax());
        c.setUsageActuels(0);
        c.setActif(ActifEnum.ACTIVE);
        return toResponse(couponRepository.save(c));
    }

    public void deleteCoupon(UUID id) { couponRepository.deleteById(id); }

    private CouponResponse toResponse(Coupon c) {
        CouponResponse r = new CouponResponse();
        r.setId(c.getId());
        r.setCode(c.getCode());
        r.setType(c.getType().name());
        r.setValeur(c.getValeur());
        r.setDateExpiration(c.getDateExpiration());
        r.setUsageMax(c.getUsageMax());
        r.setUsageActuels(c.getUsageActuels());
        r.setActif(c.getActif().name());
        return r;
    }
}

package com.baka.eshop.controller;

import com.baka.eshop.dto.*;
import com.baka.eshop.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public List<AddressResponse> getMyAddresses(Authentication auth) {
        return addressService.getMyAddresses(auth.getName());
    }

    @PostMapping
    public AddressResponse create(@Valid @RequestBody AddressRequest request, Authentication auth) {
        return addressService.createAddress(request, auth.getName());
    }

    @PutMapping("/{id}")
    public AddressResponse update(@PathVariable UUID id, @Valid @RequestBody AddressRequest request, Authentication auth) {
        return addressService.updateAddress(id, request, auth.getName());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        addressService.deleteAddress(id);
    }
}

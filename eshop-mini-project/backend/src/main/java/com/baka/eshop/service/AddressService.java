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
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<AddressResponse> getMyAddresses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        return addressRepository.findByUser(user).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public AddressResponse createAddress(AddressRequest req, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        Address a = new Address();
        a.setUser(user);
        a.setRue(req.getRue());
        a.setVille(req.getVille());
        a.setCodePostal(req.getCodePostal());
        a.setPays(req.getPays());
        a.setPrincipal(req.isPrincipal());
        if (req.isPrincipal()) clearPrimary(user);
        return toResponse(addressRepository.save(a));
    }

    public AddressResponse updateAddress(UUID id, AddressRequest req, String email) {
        Address a = addressRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Address not found"));
        a.setRue(req.getRue());
        a.setVille(req.getVille());
        a.setCodePostal(req.getCodePostal());
        a.setPays(req.getPays());
        if (req.isPrincipal()) clearPrimary(a.getUser());
        a.setPrincipal(req.isPrincipal());
        return toResponse(addressRepository.save(a));
    }

    public void deleteAddress(UUID id) { addressRepository.deleteById(id); }

    private void clearPrimary(User user) {
        addressRepository.findByUser(user).forEach(a -> {
            a.setPrincipal(false);
            addressRepository.save(a);
        });
    }

    private AddressResponse toResponse(Address a) {
        AddressResponse r = new AddressResponse();
        r.setId(a.getId());
        r.setRue(a.getRue());
        r.setVille(a.getVille());
        r.setCodePostal(a.getCodePostal());
        r.setPays(a.getPays());
        r.setPrincipal(a.isPrincipal());
        return r;
    }
}

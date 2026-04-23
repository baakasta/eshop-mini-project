package com.baka.eshop.service;

import com.baka.eshop.domain.entity.*;
import com.baka.eshop.dto.*;
import com.baka.eshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SellerProfileRepository sellerProfileRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findByActifTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAllAdminProducts() {
        return productRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> searchProducts(String query) {
        return productRepository.findByNomContainingIgnoreCase(query).stream()
                .filter(Product::isActif)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found"));
        return toResponse(product);
    }

    public List<ProductResponse> getSellerProducts(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        SellerProfile seller = sellerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Seller profile not found"));
        return productRepository.findBySeller(seller).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse createProduct(ProductRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        SellerProfile seller = sellerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "You need a seller profile first"));

        Product product = new Product();
        product.setNom(request.getNom());
        product.setDescription(request.getDescription());
        product.setPrix(request.getPrix());
        product.setPrixPromo(request.getPrixPromo());
        product.setStock(request.getStock());
        product.setActif(true);
        product.setDateCreation(Instant.now());
        product.setSeller(seller);
        product.setImages(request.getImages() != null ? request.getImages() : new ArrayList<>());

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));
            product.setCategories(categories);
        }

        return toResponse(productRepository.save(product));
    }

    public ProductResponse updateProduct(UUID id, ProductRequest request, String email) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

        if (user.getRole() != RoleEnum.ADMIN && !product.getSeller().getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(FORBIDDEN, "Not your product");
        }

        product.setNom(request.getNom());
        product.setDescription(request.getDescription());
        product.setPrix(request.getPrix());
        product.setPrixPromo(request.getPrixPromo());
        product.setStock(request.getStock());
        product.setImages(request.getImages() != null ? request.getImages() : product.getImages());

        if (request.getCategoryIds() != null) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));
            product.setCategories(categories);
        }

        return toResponse(productRepository.save(product));
    }

    public void deleteProduct(UUID id, String email) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

        if (user.getRole() != RoleEnum.ADMIN && !product.getSeller().getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(FORBIDDEN, "Not your product");
        }
        product.setActif(false);
        productRepository.save(product);
    }

    public ProductResponse toResponse(Product product) {
        ProductResponse r = new ProductResponse();
        r.setId(product.getId());
        r.setNom(product.getNom());
        r.setDescription(product.getDescription());
        r.setPrix(product.getPrix());
        r.setPrixPromo(product.getPrixPromo());
        r.setStock(product.getStock());
        r.setActif(product.isActif());
        r.setDateCreation(product.getDateCreation());
        r.setImages(product.getImages() != null ? product.getImages() : List.of());
        r.setSellerId(product.getSeller().getId());
        r.setSellerName(product.getSeller().getNomBoutique());

        if (product.getCategories() != null) {
            r.setCategories(product.getCategories().stream().map(c -> {
                CategoryResponse cr = new CategoryResponse();
                cr.setId(c.getId());
                cr.setNom(c.getNom());
                return cr;
            }).collect(Collectors.toList()));
        }

        if (product.getVariants() != null) {
            r.setVariants(product.getVariants().stream().map(v -> {
                VariantResponse vr = new VariantResponse();
                vr.setId(v.getId());
                vr.setAttribut(v.getAttribut());
                vr.setValeur(v.getValeur());
                vr.setStockSupplementaire(v.getStockSupplementaire());
                vr.setPrixDelta(v.getPrixDelta());
                return vr;
            }).collect(Collectors.toList()));
        }

        List<Review> reviews = reviewRepository.findByProductAndApprouveTrue(product);
        r.setReviewCount(reviews.size());
        r.setAverageRating(reviews.stream().mapToInt(Review::getNote).average().orElse(0));

        return r;
    }
}

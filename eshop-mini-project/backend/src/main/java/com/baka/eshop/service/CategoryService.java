package com.baka.eshop.service;

import com.baka.eshop.domain.entity.Category;
import com.baka.eshop.dto.CategoryRequest;
import com.baka.eshop.dto.CategoryResponse;
import com.baka.eshop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .filter(c -> c.getParent() == null)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getAllCategoriesFlat() {
        return categoryRepository.findAll().stream()
                .map(this::toResponseFlat)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Category not found"));
        return toResponse(category);
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setNom(request.getNom());
        category.setDescription(request.getDescription());

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Parent category not found"));
            category.setParent(parent);
        }

        return toResponse(categoryRepository.save(category));
    }

    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Category not found"));
        category.setNom(request.getNom());
        category.setDescription(request.getDescription());
        return toResponse(categoryRepository.save(category));
    }

    public void deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "Category not found");
        }
        categoryRepository.deleteById(id);
    }

    private CategoryResponse toResponse(Category category) {
        CategoryResponse r = new CategoryResponse();
        r.setId(category.getId());
        r.setNom(category.getNom());
        r.setDescription(category.getDescription());
        if (category.getParent() != null) {
            r.setParentId(category.getParent().getId());
            r.setParentNom(category.getParent().getNom());
        }
        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            r.setChildren(category.getChildren().stream().map(this::toResponse).collect(Collectors.toList()));
        }
        return r;
    }

    private CategoryResponse toResponseFlat(Category category) {
        CategoryResponse r = new CategoryResponse();
        r.setId(category.getId());
        r.setNom(category.getNom());
        r.setDescription(category.getDescription());
        if (category.getParent() != null) {
            r.setParentId(category.getParent().getId());
            r.setParentNom(category.getParent().getNom());
        }
        return r;
    }
}

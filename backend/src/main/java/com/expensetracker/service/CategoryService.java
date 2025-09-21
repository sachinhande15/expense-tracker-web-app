package com.expensetracker.service;

import com.expensetracker.dto.CategoryResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
        initializeDefaultCategories();
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::new)
                .collect(Collectors.toList());
    }

    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    public Optional<Category> findByName(String name) {
        return categoryRepository.findByName(name);
    }

    public Category createCategory(String name, String icon) {
        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Category with name '" + name + "' already exists");
        }

        Category category = new Category(name, icon);
        return categoryRepository.save(category);
    }

    private void initializeDefaultCategories() {
        if (categoryRepository.count() == 0) {
            // Create default categories based on frontend requirements
            createCategory("Food & Dining", "🍽️");
            createCategory("Transportation", "🚗");
            createCategory("Shopping", "🛍️");
            createCategory("Entertainment", "🎬");
            createCategory("Healthcare", "⚕️");
            createCategory("Education", "📚");
            createCategory("Utilities", "💡");
            createCategory("Travel", "✈️");
            createCategory("Others", "📦");
        }
    }
}

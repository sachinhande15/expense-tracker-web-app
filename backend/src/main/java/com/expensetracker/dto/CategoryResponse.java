package com.expensetracker.dto;

import com.expensetracker.entity.Category;
import java.time.LocalDateTime;

public class CategoryResponse {

    private Long id;
    private String name;
    private String icon;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public CategoryResponse() {}

    public CategoryResponse(Category category) {
        this.id = category.getId();
        this.name = category.getName();
        this.icon = category.getIcon();
        this.createdAt = category.getCreatedAt();
        this.updatedAt = category.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

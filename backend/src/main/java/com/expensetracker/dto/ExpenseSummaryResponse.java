package com.expensetracker.dto;

import java.math.BigDecimal;
import java.util.Map;

public class ExpenseSummaryResponse {

    private BigDecimal totalExpenses;
    private Long totalCount;
    private Map<String, CategorySummary> categorySummary;
    private BigDecimal monthlyTotal;

    // Constructors
    public ExpenseSummaryResponse() {}

    public ExpenseSummaryResponse(BigDecimal totalExpenses, Long totalCount,
                                 Map<String, CategorySummary> categorySummary, BigDecimal monthlyTotal) {
        this.totalExpenses = totalExpenses;
        this.totalCount = totalCount;
        this.categorySummary = categorySummary;
        this.monthlyTotal = monthlyTotal;
    }

    // Getters and Setters
    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }

    public Map<String, CategorySummary> getCategorySummary() {
        return categorySummary;
    }

    public void setCategorySummary(Map<String, CategorySummary> categorySummary) {
        this.categorySummary = categorySummary;
    }

    public BigDecimal getMonthlyTotal() {
        return monthlyTotal;
    }

    public void setMonthlyTotal(BigDecimal monthlyTotal) {
        this.monthlyTotal = monthlyTotal;
    }

    public static class CategorySummary {
        private BigDecimal total;
        private Long count;

        public CategorySummary() {}

        public CategorySummary(BigDecimal total, Long count) {
            this.total = total;
            this.count = count;
        }

        public BigDecimal getTotal() {
            return total;
        }

        public void setTotal(BigDecimal total) {
            this.total = total;
        }

        public Long getCount() {
            return count;
        }

        public void setCount(Long count) {
            this.count = count;
        }
    }
}

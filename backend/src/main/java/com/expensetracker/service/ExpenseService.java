package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.dto.ExpenseSummaryResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.entity.Category;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryService categoryService;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository, CategoryService categoryService) {
        this.expenseRepository = expenseRepository;
        this.categoryService = categoryService;
    }

    public List<ExpenseResponse> getAllExpensesByUser(User user) {
        return expenseRepository.findByUserOrderByDateDesc(user)
                .stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }

    public Optional<ExpenseResponse> getExpenseByIdAndUser(Long id, User user) {
        return expenseRepository.findById(id)
                .filter(expense -> expense.getUser().getId().equals(user.getId()))
                .map(ExpenseResponse::new);
    }

    public ExpenseResponse createExpense(ExpenseRequest request, User user) {
        // Validate category exists
        Category category = categoryService.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Validate expense type
        if (!request.getType().equals("income") && !request.getType().equals("expense")) {
            throw new RuntimeException("Invalid expense type. Must be 'income' or 'expense'");
        }

        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setDate(request.getDate());
        expense.setType(request.getType());
        expense.setUser(user);
        expense.setCategory(category);

        Expense savedExpense = expenseRepository.save(expense);
        return new ExpenseResponse(savedExpense);
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, User user) {
        Expense expense = expenseRepository.findById(id)
                .filter(exp -> exp.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        // Validate category exists
        Category category = categoryService.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Validate expense type
        if (!request.getType().equals("income") && !request.getType().equals("expense")) {
            throw new RuntimeException("Invalid expense type. Must be 'income' or 'expense'");
        }

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setDate(request.getDate());
        expense.setType(request.getType());
        expense.setCategory(category);

        Expense updatedExpense = expenseRepository.save(expense);
        return new ExpenseResponse(updatedExpense);
    }

    public void deleteExpense(Long id, User user) {
        Expense expense = expenseRepository.findById(id)
                .filter(exp -> exp.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expenseRepository.delete(expense);
    }

    public ExpenseSummaryResponse getExpenseSummaryByUser(User user) {
        List<Expense> expenses = expenseRepository.findByUserOrderByDateDesc(user);

        // Calculate totals
        BigDecimal totalExpenses = expenseRepository.getTotalAmountByUser(user);
        if (totalExpenses == null) {
            totalExpenses = BigDecimal.ZERO;
        }

        Long totalCount = expenseRepository.getExpenseCountByUser(user);
        if (totalCount == null) {
            totalCount = 0L;
        }

        // Calculate category summary
        Map<String, ExpenseSummaryResponse.CategorySummary> categorySummary = expenses.stream()
                .collect(Collectors.groupingBy(
                        expense -> expense.getCategory().getName(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    BigDecimal total = list.stream()
                                            .map(Expense::getAmount)
                                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                                    return new ExpenseSummaryResponse.CategorySummary(total, (long) list.size());
                                }
                        )
                ));

        // Calculate monthly total
        YearMonth currentMonth = YearMonth.now();
        BigDecimal monthlyTotal = expenseRepository.getMonthlyTotalByUser(
                user, currentMonth.getYear(), currentMonth.getMonthValue());
        if (monthlyTotal == null) {
            monthlyTotal = BigDecimal.ZERO;
        }

        return new ExpenseSummaryResponse(totalExpenses, totalCount, categorySummary, monthlyTotal);
    }

    public List<ExpenseResponse> getExpensesByCategory(User user, Long categoryId) {
        return expenseRepository.findByUserAndCategoryId(user, categoryId)
                .stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }

    public List<ExpenseResponse> getExpensesByType(User user, String type) {
        return expenseRepository.findByUserAndType(user, type)
                .stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }

    public List<ExpenseResponse> getExpensesByDateRange(User user, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByUserAndDateBetween(user, startDate, endDate)
                .stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }
}

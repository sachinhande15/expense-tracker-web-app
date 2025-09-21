package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.dto.ExpenseSummaryResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.service.ExpenseService;
import com.expensetracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        List<ExpenseResponse> expenses = expenseService.getAllExpensesByUser(user);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id, Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        ExpenseResponse expense = expenseService.getExpenseByIdAndUser(id, user).orElse(null);
        if (expense == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(expense);
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody ExpenseRequest expenseRequest,
                                                         Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        ExpenseResponse createdExpense = expenseService.createExpense(expenseRequest, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(@PathVariable Long id,
                                                         @Valid @RequestBody ExpenseRequest expenseRequest,
                                                         Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        ExpenseResponse updatedExpense = expenseService.updateExpense(id, expenseRequest, user);
        return ResponseEntity.ok(updatedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id, Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        expenseService.deleteExpense(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<ExpenseSummaryResponse> getExpenseSummary(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        ExpenseSummaryResponse summary = expenseService.getExpenseSummaryByUser(user);
        return ResponseEntity.ok(summary);
    }
}

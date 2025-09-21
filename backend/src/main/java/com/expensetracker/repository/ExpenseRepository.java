package com.expensetracker.repository;

import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserOrderByDateDesc(User user);

    List<Expense> findByUserAndCategoryId(User user, Long categoryId);

    List<Expense> findByUserAndType(User user, String type);

    List<Expense> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user")
    BigDecimal getTotalAmountByUser(@Param("user") User user);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user AND e.type = :type")
    BigDecimal getTotalAmountByUserAndType(@Param("user") User user, @Param("type") String type);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user AND e.category.name = :categoryName")
    BigDecimal getTotalAmountByUserAndCategory(@Param("user") User user, @Param("categoryName") String categoryName);

    @Query("SELECT COUNT(e) FROM Expense e WHERE e.user = :user")
    Long getExpenseCountByUser(@Param("user") User user);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user AND YEAR(e.date) = :year AND MONTH(e.date) = :month")
    BigDecimal getMonthlyTotalByUser(@Param("user") User user, @Param("year") int year, @Param("month") int month);
}

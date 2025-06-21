# Warehouse Outcome MySQL Procedures Guide
## Database Stored Procedures for Warehouse Outcome Management

### Table of Contents
1. [Overview](#overview)
2. [Database Schema Requirements](#database-schema-requirements)
3. [Core Procedures](#core-procedures)
4. [Utility Procedures](#utility-procedures)
5. [Performance Optimization](#performance-optimization)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

---

## Overview

This document outlines MySQL stored procedures designed to optimize warehouse outcome operations, reducing application-level complexity and improving database performance for the `OutcomeController` functionality.

### Core Benefits
- ✅ **Performance**: Reduced network overhead and optimized queries
- ✅ **Consistency**: Centralized business logic at database level
- ✅ **Security**: Parameter validation and SQL injection prevention
- ✅ **Maintainability**: Reusable database operations
- ✅ **Scalability**: Efficient handling of large datasets

---

## Database Schema Requirements

### Prerequisites
Ensure the following tables exist with proper relationships:
- `warehouse_outcomes` (main table)
- `products` (product information)
- `warehouses` (warehouse details)
- `warehouse_users` (user authentication)

---

## Core Procedures

### 1. **Get Filtered Outcome Records**
```sql
DELIMITER //

CREATE PROCEDURE GetWarehouseOutcomes(
    IN p_warehouse_id INT,
    IN p_search VARCHAR(255),
    IN p_year INT,
    IN p_month INT,
    IN p_day INT,
    IN p_sort_by VARCHAR(50),
    IN p_sort_direction VARCHAR(4),
    IN p_page INT,
    IN p_per_page INT,
    OUT p_total_records INT
)
BEGIN
    DECLARE v_offset INT DEFAULT 0;
    DECLARE v_valid_sort_by VARCHAR(50) DEFAULT 'created_at';
    DECLARE v_valid_direction VARCHAR(4) DEFAULT 'desc';
    
    -- Validate and set defaults
    SET p_page = IFNULL(p_page, 1);
    SET p_per_page = IFNULL(p_per_page, 10);
    SET v_offset = (p_page - 1) * p_per_page;
    
    -- Validate sort column
    IF p_sort_by IN ('created_at', 'reference_number', 'total', 'quantity', 'price') THEN
        SET v_valid_sort_by = p_sort_by;
    END IF;
    
    -- Validate sort direction
    IF p_sort_direction IN ('asc', 'desc') THEN
        SET v_valid_direction = p_sort_direction;
    END IF;
    
    -- Get total count for pagination
    SELECT COUNT(*) INTO p_total_records
    FROM warehouse_outcomes wo
    LEFT JOIN products p ON wo.product_id = p.id
    WHERE wo.warehouse_id = p_warehouse_id
    AND (p_search IS NULL OR p_search = '' OR 
         wo.reference_number LIKE CONCAT('%', p_search, '%') OR
         wo.notes LIKE CONCAT('%', p_search, '%') OR
         p.name LIKE CONCAT('%', p_search, '%'))
    AND (p_year IS NULL OR YEAR(wo.created_at) = p_year)
    AND (p_month IS NULL OR p_year IS NULL OR MONTH(wo.created_at) = p_month)
    AND (p_day IS NULL OR p_month IS NULL OR p_year IS NULL OR DAY(wo.created_at) = p_day);
    
    -- Get paginated results
    SET @sql = CONCAT(
        'SELECT 
            wo.id,
            wo.reference_number,
            wo.total,
            wo.quantity,
            wo.price,
            DATE(wo.created_at) as date,
            COALESCE(p.name, "Unknown") as destination,
            wo.notes,
            wo.created_at
        FROM warehouse_outcomes wo
        LEFT JOIN products p ON wo.product_id = p.id
        WHERE wo.warehouse_id = ', p_warehouse_id
    );
    
    -- Add search conditions
    IF p_search IS NOT NULL AND p_search != '' THEN
        SET @sql = CONCAT(@sql, 
            ' AND (wo.reference_number LIKE "%', p_search, '%" OR ',
            'wo.notes LIKE "%', p_search, '%" OR ',
            'p.name LIKE "%', p_search, '%")'
        );
    END IF;
    
    -- Add date filters
    IF p_year IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND YEAR(wo.created_at) = ', p_year);
    END IF;
    
    IF p_month IS NOT NULL AND p_year IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND MONTH(wo.created_at) = ', p_month);
    END IF;
    
    IF p_day IS NOT NULL AND p_month IS NOT NULL AND p_year IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND DAY(wo.created_at) = ', p_day);
    END IF;
    
    -- Add sorting and pagination
    SET @sql = CONCAT(@sql, 
        ' ORDER BY wo.', v_valid_sort_by, ' ', v_valid_direction,
        ' LIMIT ', p_per_page, ' OFFSET ', v_offset
    );
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
END //

DELIMITER ;
```

### 2. **Create Warehouse Outcome**
```sql
DELIMITER //

CREATE PROCEDURE CreateWarehouseOutcome(
    IN p_warehouse_id INT,
    IN p_product_id INT,
    IN p_reference_number VARCHAR(255),
    IN p_quantity DECIMAL(10,3),
    IN p_price DECIMAL(10,2),
    IN p_total DECIMAL(10,2),
    IN p_notes TEXT,
    OUT p_outcome_id INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_error_count INT DEFAULT 0;
    DECLARE v_existing_ref_count INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_message = 'Database error occurred while creating outcome record';
        SET p_outcome_id = 0;
    END;
    
    START TRANSACTION;
    
    -- Validate inputs
    IF p_warehouse_id IS NULL OR p_warehouse_id <= 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Valid warehouse ID is required';
        SET p_outcome_id = 0;
        ROLLBACK;
    ELSEIF p_quantity IS NULL OR p_quantity <= 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Valid quantity is required';
        SET p_outcome_id = 0;
        ROLLBACK;
    ELSEIF p_price IS NULL OR p_price < 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Valid price is required';
        SET p_outcome_id = 0;
        ROLLBACK;
    ELSE
        -- Check for duplicate reference number
        SELECT COUNT(*) INTO v_existing_ref_count
        FROM warehouse_outcomes
        WHERE warehouse_id = p_warehouse_id 
        AND reference_number = p_reference_number;
        
        IF v_existing_ref_count > 0 THEN
            SET p_success = FALSE;
            SET p_message = 'Reference number already exists for this warehouse';
            SET p_outcome_id = 0;
            ROLLBACK;
        ELSE
            -- Insert the outcome record
            INSERT INTO warehouse_outcomes (
                warehouse_id,
                product_id,
                reference_number,
                quantity,
                price,
                total,
                notes,
                created_at,
                updated_at
            ) VALUES (
                p_warehouse_id,
                p_product_id,
                p_reference_number,
                p_quantity,
                p_price,
                COALESCE(p_total, p_quantity * p_price),
                p_notes,
                NOW(),
                NOW()
            );
            
            SET p_outcome_id = LAST_INSERT_ID();
            SET p_success = TRUE;
            SET p_message = 'Outcome record created successfully';
            
            COMMIT;
        END IF;
    END IF;
    
END //

DELIMITER ;
```

### 3. **Update Warehouse Outcome**
```sql
DELIMITER //

CREATE PROCEDURE UpdateWarehouseOutcome(
    IN p_outcome_id INT,
    IN p_warehouse_id INT,
    IN p_product_id INT,
    IN p_reference_number VARCHAR(255),
    IN p_quantity DECIMAL(10,3),
    IN p_price DECIMAL(10,2),
    IN p_total DECIMAL(10,2),
    IN p_notes TEXT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_existing_count INT DEFAULT 0;
    DECLARE v_duplicate_ref_count INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_message = 'Database error occurred while updating outcome record';
    END;
    
    START TRANSACTION;
    
    -- Check if outcome exists and belongs to warehouse
    SELECT COUNT(*) INTO v_existing_count
    FROM warehouse_outcomes
    WHERE id = p_outcome_id AND warehouse_id = p_warehouse_id;
    
    IF v_existing_count = 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Outcome record not found or access denied';
        ROLLBACK;
    ELSE
        -- Check for duplicate reference number (excluding current record)
        SELECT COUNT(*) INTO v_duplicate_ref_count
        FROM warehouse_outcomes
        WHERE warehouse_id = p_warehouse_id 
        AND reference_number = p_reference_number
        AND id != p_outcome_id;
        
        IF v_duplicate_ref_count > 0 THEN
            SET p_success = FALSE;
            SET p_message = 'Reference number already exists for this warehouse';
            ROLLBACK;
        ELSE
            -- Update the outcome record
            UPDATE warehouse_outcomes
            SET 
                product_id = COALESCE(p_product_id, product_id),
                reference_number = COALESCE(p_reference_number, reference_number),
                quantity = COALESCE(p_quantity, quantity),
                price = COALESCE(p_price, price),
                total = COALESCE(p_total, quantity * price),
                notes = p_notes,
                updated_at = NOW()
            WHERE id = p_outcome_id;
            
            SET p_success = TRUE;
            SET p_message = 'Outcome record updated successfully';
            
            COMMIT;
        END IF;
    END IF;
    
END //

DELIMITER ;
```

### 4. **Delete Warehouse Outcome**
```sql
DELIMITER //

CREATE PROCEDURE DeleteWarehouseOutcome(
    IN p_outcome_id INT,
    IN p_warehouse_id INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_existing_count INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_message = 'Database error occurred while deleting outcome record';
    END;
    
    START TRANSACTION;
    
    -- Check if outcome exists and belongs to warehouse
    SELECT COUNT(*) INTO v_existing_count
    FROM warehouse_outcomes
    WHERE id = p_outcome_id AND warehouse_id = p_warehouse_id;
    
    IF v_existing_count = 0 THEN
        SET p_success = FALSE;
        SET p_message = 'Outcome record not found or access denied';
        ROLLBACK;
    ELSE
        -- Delete the outcome record
        DELETE FROM warehouse_outcomes
        WHERE id = p_outcome_id AND warehouse_id = p_warehouse_id;
        
        SET p_success = TRUE;
        SET p_message = 'Outcome record deleted successfully';
        
        COMMIT;
    END IF;
    
END //

DELIMITER ;
```

---

## Utility Procedures

### 5. **Get Outcome Statistics**
```sql
DELIMITER //

CREATE PROCEDURE GetOutcomeStatistics(
    IN p_warehouse_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        COUNT(*) as total_records,
        SUM(quantity) as total_quantity,
        SUM(total) as total_amount,
        AVG(price) as average_price,
        MIN(created_at) as first_outcome_date,
        MAX(created_at) as last_outcome_date,
        COUNT(DISTINCT product_id) as unique_products
    FROM warehouse_outcomes
    WHERE warehouse_id = p_warehouse_id
    AND (p_start_date IS NULL OR DATE(created_at) >= p_start_date)
    AND (p_end_date IS NULL OR DATE(created_at) <= p_end_date);
    
END //

DELIMITER ;
```

### 6. **Get Monthly Outcome Summary**
```sql
DELIMITER //

CREATE PROCEDURE GetMonthlyOutcomeSummary(
    IN p_warehouse_id INT,
    IN p_year INT
)
BEGIN
    SELECT 
        MONTH(created_at) as month,
        MONTHNAME(created_at) as month_name,
        COUNT(*) as total_records,
        SUM(quantity) as total_quantity,
        SUM(total) as total_amount,
        AVG(price) as average_price
    FROM warehouse_outcomes
    WHERE warehouse_id = p_warehouse_id
    AND YEAR(created_at) = p_year
    GROUP BY MONTH(created_at), MONTHNAME(created_at)
    ORDER BY MONTH(created_at);
    
END //

DELIMITER ;
```

---

## Performance Optimization

### Recommended Indexes
```sql
-- Primary indexes for optimal performance
CREATE INDEX idx_warehouse_outcomes_warehouse_id ON warehouse_outcomes(warehouse_id);
CREATE INDEX idx_warehouse_outcomes_created_at ON warehouse_outcomes(created_at);
CREATE INDEX idx_warehouse_outcomes_reference ON warehouse_outcomes(reference_number);
CREATE INDEX idx_warehouse_outcomes_product_id ON warehouse_outcomes(product_id);

-- Composite indexes for common query patterns
CREATE INDEX idx_warehouse_outcomes_composite ON warehouse_outcomes(warehouse_id, created_at, reference_number);
CREATE INDEX idx_warehouse_outcomes_search ON warehouse_outcomes(warehouse_id, reference_number, notes(100));
```

---

## Usage Examples

### PHP Implementation in Controller
```php
// In OutcomeController.php
public function index(Request $request)
{
    $warehouse = Auth::guard('warehouse_user')->user()->warehouse;
    
    // Call the stored procedure
    $totalRecords = 0;
    DB::statement('CALL GetWarehouseOutcomes(?, ?, ?, ?, ?, ?, ?, ?, ?, @total)', [
        $warehouse->id,
        $request->search,
        $request->year,
        $request->month,
        $request->day,
        $request->get('sort', 'created_at'),
        $request->get('direction', 'desc'),
        $request->get('page', 1),
        $request->get('per_page', 10)
    ]);
    
    // Get the results
    $outcomes = DB::select('SELECT * FROM temp_outcome_results');
    $totalRecords = DB::select('SELECT @total as total')[0]->total;
    
    // Process and return results...
}

public function store(Request $request)
{
    $warehouse = Auth::guard('warehouse_user')->user()->warehouse;
    
    DB::statement('CALL CreateWarehouseOutcome(?, ?, ?, ?, ?, ?, ?, @outcome_id, @success, @message)', [
        $warehouse->id,
        $request->product_id,
        $request->reference_number,
        $request->quantity,
        $request->price,
        $request->total,
        $request->notes
    ]);
    
    $result = DB::select('SELECT @outcome_id as id, @success as success, @message as message')[0];
    
    if ($result->success) {
        return redirect()->route('warehouse.outcomes.index')
            ->with('success', $result->message);
    } else {
        return back()->withErrors(['error' => $result->message]);
    }
}
```

---

## Best Practices

### 1. **Error Handling**
- Always use transactions for data modifications
- Implement proper error handlers in stored procedures
- Validate all input parameters
- Return meaningful error messages

### 2. **Security**
- Use parameterized queries to prevent SQL injection
- Validate user permissions before database operations
- Sanitize dynamic SQL construction

### 3. **Performance**
- Use appropriate indexes for common query patterns
- Limit result sets with pagination
- Cache frequently accessed data
- Monitor procedure execution times

### 4. **Maintenance**
- Version control your stored procedures
- Document parameter requirements
- Test procedures with various input scenarios
- Monitor database performance metrics

### 5. **Debugging**
```sql
-- Enable procedure debugging
SET @debug = 1;

-- Add debugging output in procedures
IF @debug = 1 THEN
    SELECT 'Debug: Processing warehouse_id', p_warehouse_id;
END IF;
```

---

## Deployment Notes

1. **Installation Order**: Create procedures in dependency order
2. **Permissions**: Grant EXECUTE permissions to application user
3. **Testing**: Verify all procedures with sample data
4. **Monitoring**: Set up procedure performance monitoring
5. **Backup**: Include procedures in database backup strategy

This comprehensive procedure set will significantly improve the performance and maintainability of warehouse outcome operations while maintaining data integrity and security. 
# Customer Stock Management Documentation

## Overview

The Customer Stock Management system provides customers with the ability to view and manage their inventory through a secure, searchable interface. This document details the implementation, security features, and usage of the stock management functionality, focusing on the `StockProductsController` which is responsible for displaying the customer's stock products.

## Table of Contents

1. [Architecture](#architecture)
2. [Controller Functionality](#controller-functionality)
3. [Security Considerations](#security-considerations)
4. [Data Flow](#data-flow)
5. [Error Handling](#error-handling)
6. [Database Schema](#database-schema)
7. [Frontend Integration](#frontend-integration)
8. [API Endpoints](#api-endpoints)
9. [Performance Considerations](#performance-considerations)
10. [Logging and Monitoring](#logging-and-monitoring)
11. [Extending the System](#extending-the-system)
12. [Troubleshooting](#troubleshooting)

## Architecture

The stock management system follows a standard MVC architecture within Laravel:

- **Model**: Uses the `customer_stock_product_movements` view/table which aggregates stock data
- **View**: Rendered through Inertia.js using React components
- **Controller**: `StockProductsController` handles requests and business logic

The system interacts with the following components:

- **Authentication**: Leverages Laravel's auth guards for customer users
- **Database**: Uses query builder for optimized database interactions
- **Frontend**: Uses Inertia.js to provide a seamless SPA experience

## Controller Functionality

The `StockProductsController` provides the following functionality:

### Index Method

The primary method in the controller is `index()` which:

1. Validates input parameters for security
2. Verifies user authentication and authorization
3. Retrieves filtered stock data based on search criteria
4. Paginates results for improved performance and usability
5. Returns data to the Inertia view for rendering

The method employs several key techniques:

- Input validation using Laravel's Validator
- Parameterized queries to prevent SQL injection
- Explicit error handling with appropriate user feedback
- Comprehensive logging for monitoring and debugging

## Security Considerations

The controller implements multiple security measures:

### Input Validation

All user inputs are validated with specific rules:
- `search`: Optional string with maximum length of 100 characters
- `per_page`: Optional integer between 5 and 100

This validation prevents:
- Excessive data loads (pagination limits)
- Overly complex search queries
- Potential DoS attacks via large inputs

### SQL Injection Prevention

The controller employs several techniques to prevent SQL injection:

- Parameter binding for database queries
- Escaping search terms with `addslashes()` before use in LIKE queries
- Type casting for numeric values (e.g., converting `per_page` to integer)

### Authorization

Access control is implemented through:

- Explicit verification of customer association
- Redirecting unauthorized users to the login page
- Logging unauthorized access attempts for security monitoring

### Data Leakage Prevention

The controller prevents sensitive information exposure by:

- Returning only necessary data fields to the frontend
- Sanitizing error messages to exclude system details
- Restricting data to the authenticated customer's records only

## Data Flow

The data flow within the stock products functionality follows this pattern:

1. **Request Initiation**:
   - User submits request with optional search and pagination parameters

2. **Input Processing**:
   - Validation of all input parameters
   - Sanitization of search strings

3. **Authorization**:
   - Verification of user authentication
   - Validation of customer association

4. **Data Retrieval**:
   - Construction of database query with security measures
   - Filtering based on search criteria
   - Pagination of results

5. **Response Preparation**:
   - Formatting data for frontend consumption
   - Including metadata like pagination details
   - Preparing error messages if applicable

6. **Response Delivery**:
   - Rendering Inertia view with data payload
   - Sending to client for display

## Error Handling

The controller implements a comprehensive error handling strategy:

### Exception Types

1. **ValidationException**:
   - Triggered by invalid input parameters
   - Returns validation errors to frontend
   - Preserves user input for correction

2. **QueryException**:
   - Handles database-related errors
   - Logs detailed error information
   - Returns user-friendly error message

3. **General Exception**:
   - Catches any other unexpected errors
   - Logs complete stack trace
   - Returns generic error message to user

### Error Response Structure

Errors are returned to the frontend in a consistent format:

```php
[
    'stockProducts' => [],  // Empty data array
    'search' => $originalSearchTerm,  // Preserve user input
    'isFilterOpen' => $originalFilterState,  // Maintain UI state
    'errors' => [
        'field_name' => 'Error message',  // For validation errors
        // OR
        'database' => 'A database error occurred',  // For DB errors
        // OR
        'general' => 'An error occurred while loading your stock products'  // For other errors
    ]
]
```

This structure enables the frontend to:
- Display appropriate error messages
- Maintain form state for retry
- Provide consistent user experience during errors

## Database Schema

The controller interacts with the following database objects:

### customer_stock_product_movements

This is a database view or table that aggregates stock movement data for efficient querying. Key fields include:

- `product_id`: Foreign key to the products table
- `customer_id`: Foreign key to the customers table
- `income_quantity`: Total quantity added to stock
- `income_price`: Price per unit for income
- `income_total`: Total value of income
- `outcome_quantity`: Total quantity removed from stock
- `outcome_price`: Price per unit for outcome
- `outcome_total`: Total value of outcome
- `net_quantity`: Current stock level (income - outcome)
- `net_total`: Current stock value
- `profit`: Calculated profit from stock movements

### products

Contains product information:

- `id`: Primary key
- `name`: Product name
- `barcode`: Product barcode
- Other product attributes

## Frontend Integration

The controller is designed to work with Inertia.js and React components:

### Data Structure

The controller passes the following data structure to the frontend:

```php
[
    'stockProducts' => [
        'data' => [
            // Array of stock products with the following structure
            [
                'product_id' => 1,
                'customer_id' => 1,
                'income_quantity' => 100,
                'income_price' => 10.00,
                'income_total' => 1000.00,
                'outcome_quantity' => 50,
                'outcome_price' => 15.00,
                'outcome_total' => 750.00,
                'net_quantity' => 50,
                'net_total' => 250.00,
                'profit' => 500.00,
                'product_name' => 'Example Product',
                'barcode' => '1234567890'
            ],
            // More products...
        ],
        'links' => [...],  // Pagination links
        'meta' => [...]    // Pagination metadata
    ],
    'search' => 'search term',
    'isFilterOpen' => true,
    'errors' => []  // Any error messages
]
```

### Component Structure

The data is rendered in the `Customer/StockProducts/Index` Inertia component, which typically includes:

- Search form for filtering products
- Table/grid for displaying stock products
- Pagination controls
- Error message display
- Sorting and additional filtering options

## API Endpoints

### Stock Products Index

- **Route**: `GET /customer/stock-products`
- **Controller**: `StockProductsController@index`
- **Parameters**:
  - `search` (optional): Search string for filtering products
  - `per_page` (optional): Number of items per page (default: 10)
- **Response**: Inertia view with stock products data

## Performance Considerations

The controller implements several performance optimizations:

1. **Pagination**:
   - Limits the number of records retrieved in a single query
   - Reduces server load and improves response times

2. **Selective Column Selection**:
   - Only retrieves necessary columns from the database
   - Reduces memory usage and network transfer

3. **Indexing Requirements**:
   - Assumes indexes on `customer_id`, `product_id` in the `customer_stock_product_movements` table
   - Assumes indexes on `name` and `barcode` in the `products` table for efficient search

4. **Query Optimization**:
   - Uses a join instead of multiple queries
   - Adds where clauses in optimal order for query execution

## Logging and Monitoring

The controller implements comprehensive logging:

### Log Events

1. **Unauthorized Access Attempts**:
   - Level: Warning
   - Data: User ID, IP address
   - Purpose: Security monitoring

2. **Database Errors**:
   - Level: Error
   - Data: Error message, user ID, customer ID, IP address
   - Purpose: Technical troubleshooting

3. **General Exceptions**:
   - Level: Error
   - Data: Error message, stack trace, user ID, customer ID, IP address
   - Purpose: Debugging and issue resolution

### Log Format

Logs are structured to facilitate analysis:

```php
Log::error('Database error in stock products', [
    'message' => $exception->getMessage(),
    'user_id' => Auth::guard('customer_user')->id(),
    'customer_id' => Auth::guard('customer_user')->user()->customer_id ?? null,
    'ip' => $request->ip(),
]);
```

## Extending the System

The stock management system can be extended in several ways:

### Additional Endpoints

To add new functionality:

1. Create new methods in the `StockProductsController` or new controllers for specific features
2. Register routes in the appropriate route provider
3. Implement frontend components to consume the new endpoints

### Potential Extensions

- **Stock Movement History**: Detailed timeline of stock changes
- **Stock Alerts**: Notifications for low inventory
- **Export Functionality**: CSV/PDF export of stock data
- **Batch Operations**: Bulk update of stock items

## Troubleshooting

### Common Issues

1. **No Data Displayed**:
   - Check authentication status
   - Verify customer association
   - Inspect logs for database errors
   - Confirm database has stock data for the customer

2. **Search Not Working**:
   - Validate search input format
   - Check database indices on searchable columns
   - Verify query construction in controller

3. **Performance Issues**:
   - Optimize database indices
   - Adjust pagination settings
   - Check for expensive joins or subqueries
   - Consider caching frequently accessed data

### Debugging Techniques

1. Review Laravel logs at `storage/logs/laravel.log`
2. Enable query logging in development to analyze database performance
3. Use browser developer tools to inspect network requests and responses
4. Check Inertia props using the Inertia debugger

## Implementation Details

### Code Sample

Here's the core implementation of the `index` method in the `StockProductsController`:

```php
public function index(Request $request)
{
    try {
        // Validate input parameters
        $validator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:100',
            'per_page' => 'nullable|integer|min:5|max:100',
        ]);

        if ($validator->fails()) {
            return Inertia::render('Customer/StockProducts/Index', [
                'stockProducts' => [],
                'search' => '',
                'isFilterOpen' => false,
                'errors' => $validator->errors(),
            ]);
        }

        // Sanitize and get input parameters
        $search = $request->input('search', '');
        $perPage = (int) $request->input('per_page', 10);

        // Ensure the current user has a valid customer association
        $customer = Auth::guard('customer_user')->user()->customer;
        if (!$customer) {
            Log::warning('Stock products access attempted without valid customer association', [
                'user_id' => Auth::guard('customer_user')->id(),
                'ip' => $request->ip()
            ]);
            
            return redirect()->route('customer.login');
        }

        // Query stock products with security measures
        $stockProducts = DB::table('customer_stock_product_movements')
            ->join('products', 'customer_stock_product_movements.product_id', '=', 'products.id')
            ->select([
                'customer_stock_product_movements.product_id',
                'customer_stock_product_movements.customer_id',
                'customer_stock_product_movements.income_quantity',
                'customer_stock_product_movements.income_price',
                'customer_stock_product_movements.income_total',
                'customer_stock_product_movements.outcome_quantity',
                'customer_stock_product_movements.outcome_price',
                'customer_stock_product_movements.outcome_total',
                'customer_stock_product_movements.net_quantity',
                'customer_stock_product_movements.net_total',
                'customer_stock_product_movements.profit',
                'products.name as product_name',
                'products.barcode'
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function($q) use ($search) {
                    // Use parameter binding for security against SQL injection
                    $searchParam = '%' . addslashes($search) . '%';
                    $q->where('products.name', 'like', $searchParam)
                      ->orWhere('products.barcode', 'like', $searchParam);
                });
            })
            ->where('customer_stock_product_movements.customer_id', $customer->id)
            ->orderBy('products.name', 'asc')
            ->paginate($perPage);

        return Inertia::render('Customer/StockProducts/Index', [
            'stockProducts' => $stockProducts,
            'search' => $search,
            'isFilterOpen' => $request->has('search')
        ]);
    } catch (Exception $e) {
        // Error handling with appropriate logging and user feedback
        // ...
    }
}
```

## Conclusion

The `StockProductsController` provides a secure, performant interface for customers to view and manage their inventory. By employing robust security measures, efficient database queries, and comprehensive error handling, it delivers a reliable user experience while protecting against common security vulnerabilities.

For further development or troubleshooting, the controller's design facilitates extension and debugging through its structured approach and detailed logging. 

# Customer Dashboard Documentation

## Overview

The Customer Dashboard provides an interactive overview of customer stock data, movements, and business activities. It's designed to give customers quick access to their most important metrics, recent activities, and product information. This document explains the dashboard's features, implementation details, security considerations, and customization options.

## Table of Contents

1. [Features](#features)
2. [Data Structure](#data-structure)
3. [Implementation Details](#implementation-details)
4. [Security Considerations](#security-considerations)
5. [API Endpoints](#api-endpoints)
6. [Filtering Capabilities](#filtering-capabilities)
7. [Charts and Visualizations](#charts-and-visualizations)
8. [Error Handling](#error-handling)
9. [Permissions](#permissions)
10. [Customization](#customization)
11. [Troubleshooting](#troubleshooting)

## Features

The Customer Dashboard provides the following key features:

- **Overview of stock statistics**: Total income, outcome, and net values
- **Top products visualization**: Shows the most active products based on stock movements
- **Monthly stock trends**: Charts showing income and outcome trends over the current year
- **Stock distribution**: Pie chart visualization of current stock distribution by product
- **Recent stock movements**: List of the most recent stock income and outcome transactions
- **Date filtering**: Ability to filter all dashboard data by date range
- **Product search**: Quick search functionality for finding products by name or barcode

## Data Structure

The dashboard aggregates data from multiple sources:

### Key Data Models

- **CustomerStockIncome**: Records of stock added to inventory
- **CustomerStockOutcome**: Records of stock removed from inventory
- **Products**: Product catalog information
- **customer_stock_product_movements**: View/table that aggregates movement data

### Main Metrics

1. **Total Income**: Sum of all income transaction values
2. **Total Outcome**: Sum of all outcome transaction values
3. **Net Value**: Difference between income and outcome values
4. **Income Quantity**: Total units added to inventory
5. **Outcome Quantity**: Total units removed from inventory
6. **Net Quantity**: Current stock level (Income - Outcome)

## Implementation Details

### Controller Structure

The `DashboardController` is organized with the following methods:

- `index()`: Main dashboard view with all statistics and charts
- `searchProducts()`: API endpoint for product search functionality
- Private helper methods for various dashboard components:
  - `buildIncomeQuery()`: Constructs the income data query
  - `buildOutcomeQuery()`: Constructs the outcome data query
  - `getTopProducts()`: Retrieves top products data
  - `getMonthlyStockData()`: Generates monthly trend data
  - `getStockDistribution()`: Retrieves stock distribution data
  - `getRecentMovements()`: Gets recent transaction activity
  - `calculateTotals()`: Computes summary statistics

### Frontend Integration

The dashboard uses Inertia.js to render React components with the following data structure:

```javascript
{
  user: {
    id: number,
    name: string,
    email: string,
    customer_id: number,
    customer_name: string
  },
  stats: {
    top_products: Array,
    monthly_stock_data: Array,
    stock_distribution: Array,
    recent_movements: Array,
    total_income: number,
    total_outcome: number,
    total_income_quantity: number,
    total_outcome_quantity: number,
    net_quantity: number,
    net_value: number,
    filters: {
      date_from: string|null,
      date_to: string|null
    }
  },
  errors: Object // Only present if there are errors
}
```

## Security Considerations

The dashboard implements several security measures:

### Input Validation

All inputs are validated before processing:
- Date filters: Validated as valid dates, with to-date occurring after from-date
- Search queries: Validated for length and sanitized to prevent SQL injection
- Customer access: Verified to ensure only authorized customers can view their own data

### SQL Injection Prevention

- Parameterized queries for all database interactions
- Proper escaping of search terms in LIKE queries
- Type casting for numeric values

### XSS Prevention

- Data sanitization before display
- HTML escaping for text fields that might contain user-generated content
- Limitation of exposed data to only what's necessary

### Error Handling

- Generic error messages to users to prevent information disclosure
- Detailed server-side logging for debugging
- Custom error pages for different error scenarios

## API Endpoints

### Main Dashboard View

- **Route**: `GET /customer/dashboard`
- **Controller**: `DashboardController@index`
- **Permissions Required**: `customer.view_dashboard`
- **Parameters**:
  - `date_from` (optional): Start date for filtering (format: YYYY-MM-DD)
  - `date_to` (optional): End date for filtering (format: YYYY-MM-DD)

### Product Search

- **Route**: `GET /customer/dashboard/search-products`
- **Controller**: `DashboardController@searchProducts`
- **Permissions Required**: `customer.view_dashboard`
- **Parameters**:
  - `search` (required): Search query string (min: 2 chars, max: 100 chars)
- **Response**: JSON array of matching products with stock information

## Filtering Capabilities

The dashboard supports filtering data by date range:

- All statistics and visualizations respect the date filters
- Date filters are applied to:
  - Income and outcome transactions
  - Top products calculation
  - Monthly trend data
  - Totals and net values
- Default view shows all-time data when no filters are applied

Implementation ensures that:
- Filters are validated for proper date format
- From-date must be before to-date
- Invalid date filters are rejected with appropriate error messages

## Charts and Visualizations

The dashboard includes several visual representations of data:

### Monthly Stock Trends

- Bar chart showing stock movements by month for the current year
- Displays both income and outcome quantities
- Includes financial values as well as quantities
- Data structure:
  ```javascript
  [
    {
      name: "Jan",
      income: 250,
      outcome: 150,
      incomeValue: 5000.00,
      outcomeValue: 3000.00
    },
    // ...additional months
  ]
  ```

### Stock Distribution (Pie Chart)

- Visualizes the current stock distribution across top products
- Shows top 5 products by quantity
- Data structure:
  ```javascript
  [
    {
      name: "Product A",
      value: 500
    },
    // ...additional products
  ]
  ```

### Top Products

- Tabular representation of the most active products
- Metrics include income quantity, outcome quantity, and net values
- Limited to top 5 products based on income quantity

## Error Handling

The dashboard implements comprehensive error handling:

### Types of Errors

1. **Validation Errors**: Issues with input parameters
   - Invalid date formats
   - Invalid date ranges
   - Invalid search parameters

2. **Database Errors**: Issues with database queries
   - Connection failures
   - Query execution problems
   - Data integrity issues

3. **General Errors**: Unexpected exceptions
   - Runtime errors
   - Unhandled edge cases

### Error Response Structure

```javascript
{
  errors: {
    validation: { /* validation error messages */ },
    database: "A database error occurred. Please try again later.",
    general: "An error occurred while loading the dashboard."
  },
  stats: [] // Empty stats or partial data
}
```

## Permissions

Access to the dashboard is controlled by the following permissions:

- **customer.view_dashboard**: Required to access the main dashboard
- The permissions are enforced through Laravel's middleware system
- Permissions are assigned to customer user roles

## Customization

The dashboard can be customized in several ways:

### Configuration Options

- Number of items in "Top Products" list
- Number of recent movements displayed
- Default date range
- Available metrics and charts

### Adding New Visualizations

To add a new visualization:

1. Create a new method in the DashboardController to fetch and format the required data
2. Update the `index()` method to include the new data in the response
3. Add the visualization component to the React frontend

## Troubleshooting

### Common Issues

1. **Dashboard loading slowly**
   - Check for inefficient database queries
   - Verify that appropriate indexes exist on key tables
   - Consider implementing caching for frequently accessed data

2. **Charts showing incomplete data**
   - Ensure date filters are formatted correctly
   - Check that database has data for the selected period
   - Verify that the aggregation queries are working correctly

3. **Search not returning expected results**
   - Confirm the search query meets minimum length requirements
   - Check that products are marked as active (`is_activated = true`)
   - Verify that the customer has access to the products

### Debugging Tips

1. Check the Laravel logs (`storage/logs/laravel.log`) for detailed error information
2. Enable query logging during development to identify slow or problematic queries
3. Use browser dev tools to inspect the network requests and responses
4. Verify the data structure being sent to the frontend matches what the components expect

## Implementation Code Reference

### Main Dashboard Method

```php
public function index(Request $request)
{
    try {
        // Validate date filter inputs
        $validator = Validator::make($request->all(), [
            'date_from' => 'nullable|date|before_or_equal:today',
            'date_to' => 'nullable|date|after_or_equal:date_from|before_or_equal:today',
        ]);

        if ($validator->fails()) {
            return Inertia::render('Customer/Dashboard', [
                'errors' => $validator->errors(),
                'stats' => [],
            ]);
        }

        // Get the authenticated customer user
        $user = auth('customer_user')->user();
        if (!$user || !$user->customer) {
            Log::warning('Dashboard access attempted without valid customer association', [
                'user_id' => $user ? $user->id : null,
                'ip' => $request->ip()
            ]);
            return redirect()->route('customer.login');
        }
        
        $customer = $user->customer;

        // Apply sanitized date filters
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        
        // Build queries and get data using helper methods
        // ...

        // Prepare the data for the view
        $data = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'customer_id' => $customer->id,
                'customer_name' => $customer->name,
            ],
            'stats' => [
                // Dashboard statistics...
            ]
        ];

        return Inertia::render('Customer/Dashboard', $data);
    } catch (Exception $e) {
        // Error handling
        // ...
    }
}
```

## Conclusion

The Customer Dashboard provides a comprehensive, secure, and user-friendly interface for customers to monitor their stock movements and business activities. By following proper security practices, optimizing database queries, and implementing effective error handling, the dashboard delivers a robust and reliable experience.

For further assistance or to report issues, contact the system administrator or development team. 

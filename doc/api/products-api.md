# Product Management API Documentation

## Overview

This API provides endpoints for managing products in the inventory system. All endpoints require authentication using Laravel Sanctum tokens.

## Base URL

```
http://your-domain.com/api
```

## Authentication

All API endpoints require authentication using Bearer tokens. Include the token in the Authorization header:

```
Authorization: Bearer your-api-token-here
```

### Getting a Token

#### Login

```http
POST /api/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password",
    "device_name": "mobile_app"
}
```

#### Register

```http
POST /api/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password",
    "password_confirmation": "password",
    "device_name": "mobile_app"
}
```

#### Logout

```http
POST /api/logout
Authorization: Bearer your-token
```

#### Logout from All Devices

```http
POST /api/logout-all
Authorization: Bearer your-token
```

## Product Endpoints

### 1. Get All Products

Retrieve a paginated list of products with optional filtering and sorting.

```http
GET /api/products
Authorization: Bearer your-token
```

#### Query Parameters

| Parameter      | Type    | Description                                | Example  |
| -------------- | ------- | ------------------------------------------ | -------- |
| `page`         | integer | Page number for pagination                 | `1`      |
| `per_page`     | integer | Items per page (max 100)                   | `15`     |
| `search`       | string  | Search by name, code, or description       | `laptop` |
| `category_id`  | integer | Filter by category ID                      | `1`      |
| `warehouse_id` | integer | Filter by warehouse ID                     | `1`      |
| `sort`         | string  | Sort field (`name`, `price`, `created_at`) | `name`   |
| `direction`    | string  | Sort direction (`asc`, `desc`)             | `asc`    |

#### Example Request

```http
GET /api/products?page=1&per_page=15&search=laptop&sort=name&direction=asc
Authorization: Bearer your-token
```

#### Example Response

```json
{
    "data": [
        {
            "id": 1,
            "name": "Laptop Dell Inspiron",
            "code": "LAP001",
            "description": "High performance laptop",
            "price": "999.99",
            "cost": "500.00",
            "quantity": 50,
            "min_quantity": 5,
            "image": null,
            "barcode": "123456789",
            "status": true,
            "tax_rate": "10.00",
            "category": {
                "id": 1,
                "name": "Electronics",
                "description": "Electronic devices"
            },
            "unit": {
                "id": 1,
                "name": "Piece",
                "symbol": "pcs"
            },
            "warehouses": [
                {
                    "id": 1,
                    "name": "Main Warehouse",
                    "location": "Building A",
                    "quantity": 30
                }
            ],
            "total_value": "49,999.50",
            "cost_value": "25,000.00",
            "profit_margin": "50.00",
            "is_low_stock": false,
            "created_at": "2024-01-01 00:00:00",
            "updated_at": "2024-01-01 00:00:00",
            "deleted_at": null
        }
    ],
    "links": {
        "first": "http://localhost/api/products?page=1",
        "last": "http://localhost/api/products?page=10",
        "prev": null,
        "next": "http://localhost/api/products?page=2"
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 10,
        "per_page": 15,
        "to": 15,
        "total": 150
    }
}
```

### 2. Create Product

Create a new product in the inventory.

```http
POST /api/products
Authorization: Bearer your-token
Content-Type: application/json
```

#### Request Body

| Field                  | Type    | Required | Description                          |
| ---------------------- | ------- | -------- | ------------------------------------ |
| `name`                 | string  | Yes      | Product name (max 255 chars)         |
| `code`                 | string  | Yes      | Unique product code (max 100 chars)  |
| `description`          | string  | No       | Product description (max 1000 chars) |
| `price`                | numeric | Yes      | Selling price (min 0)                |
| `cost`                 | numeric | Yes      | Cost price (min 0)                   |
| `quantity`             | integer | Yes      | Initial quantity (min 0)             |
| `min_quantity`         | integer | No       | Minimum stock threshold              |
| `category_id`          | integer | Yes      | Category ID (must exist)             |
| `unit_id`              | integer | Yes      | Unit ID (must exist)                 |
| `image`                | string  | No       | Image URL or path                    |
| `barcode`              | string  | No       | Product barcode (unique)             |
| `status`               | boolean | No       | Product status (default: true)       |
| `tax_rate`             | numeric | No       | Tax rate percentage (0-100)          |
| `warehouse_quantities` | array   | No       | Initial warehouse stock              |

#### Example Request

```json
{
    "name": "Laptop Dell Inspiron 15",
    "code": "LAP001",
    "description": "High performance laptop with Intel i7 processor",
    "price": 999.99,
    "cost": 500.0,
    "quantity": 50,
    "min_quantity": 5,
    "category_id": 1,
    "unit_id": 1,
    "barcode": "123456789012",
    "status": true,
    "tax_rate": 10.0,
    "warehouse_quantities": [
        {
            "warehouse_id": 1,
            "quantity": 30
        },
        {
            "warehouse_id": 2,
            "quantity": 20
        }
    ]
}
```

#### Example Response

```json
{
    "data": {
        "id": 1,
        "name": "Laptop Dell Inspiron 15",
        "code": "LAP001",
        "description": "High performance laptop with Intel i7 processor",
        "price": "999.99",
        "cost": "500.00",
        "quantity": 50,
        "min_quantity": 5,
        "category": {
            "id": 1,
            "name": "Electronics"
        },
        "unit": {
            "id": 1,
            "name": "Piece"
        },
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-01 00:00:00"
    },
    "message": "Product created successfully"
}
```

### 3. Get Single Product

Retrieve details of a specific product.

```http
GET /api/products/{id}
Authorization: Bearer your-token
```

#### Example Request

```http
GET /api/products/1
Authorization: Bearer your-token
```

#### Example Response

```json
{
    "data": {
        "id": 1,
        "name": "Laptop Dell Inspiron 15",
        "code": "LAP001",
        "description": "High performance laptop with Intel i7 processor",
        "price": "999.99",
        "cost": "500.00",
        "quantity": 50,
        "min_quantity": 5,
        "category": {
            "id": 1,
            "name": "Electronics"
        },
        "unit": {
            "id": 1,
            "name": "Piece"
        },
        "warehouses": [
            {
                "id": 1,
                "name": "Main Warehouse",
                "quantity": 30
            }
        ],
        "created_at": "2024-01-01 00:00:00",
        "updated_at": "2024-01-01 00:00:00"
    }
}
```

### 4. Update Product

Update an existing product.

```http
PUT /api/products/{id}
Authorization: Bearer your-token
Content-Type: application/json
```

#### Request Body

Same fields as create product, but all fields are optional.

#### Example Request

```json
{
    "name": "Updated Laptop Dell Inspiron 15",
    "price": 1099.99,
    "quantity": 45
}
```

#### Example Response

```json
{
    "data": {
        "id": 1,
        "name": "Updated Laptop Dell Inspiron 15",
        "code": "LAP001",
        "price": "1,099.99",
        "quantity": 45,
        "updated_at": "2024-01-01 12:00:00"
    },
    "message": "Product updated successfully"
}
```

### 5. Delete Product

Soft delete a product (can be restored later).

```http
DELETE /api/products/{id}
Authorization: Bearer your-token
```

#### Example Request

```http
DELETE /api/products/1
Authorization: Bearer your-token
```

#### Example Response

```json
{
    "message": "Product deleted successfully"
}
```

### 6. Search Products

Search products by name, code, or description.

```http
GET /api/products/search/{query}
Authorization: Bearer your-token
```

#### Query Parameters

| Parameter | Type    | Description                        |
| --------- | ------- | ---------------------------------- |
| `limit`   | integer | Limit results (max 50, default 10) |

#### Example Request

```http
GET /api/products/search/laptop?limit=5
Authorization: Bearer your-token
```

#### Example Response

```json
{
    "data": [
        {
            "id": 1,
            "name": "Laptop Dell Inspiron",
            "code": "LAP001",
            "price": "999.99",
            "quantity": 50
        }
    ]
}
```

### 7. Restore Product

Restore a soft-deleted product.

```http
GET /api/products/{id}/restore
Authorization: Bearer your-token
```

#### Example Response

```json
{
    "message": "Product restored successfully"
}
```

### 8. Force Delete Product

Permanently delete a product (cannot be restored).

```http
DELETE /api/products/{id}/force-delete
Authorization: Bearer your-token
```

#### Example Response

```json
{
    "message": "Product permanently deleted"
}
```

## Error Responses

### Validation Errors (422)

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "name": ["Product name is required."],
        "code": ["This product code is already taken."],
        "price": ["Product price must be a valid number."]
    }
}
```

### Not Found (404)

```json
{
    "message": "Product not found"
}
```

### Unauthorized (401)

```json
{
    "message": "Unauthenticated."
}
```

### Server Error (500)

```json
{
    "message": "Server Error",
    "error": "Internal server error occurred"
}
```

## Rate Limiting

API requests are rate-limited to 60 requests per minute per authenticated user.

## Additional Notes

1. **Pagination**: All list endpoints support pagination with `page` and `per_page` parameters.
2. **Filtering**: Use query parameters to filter results by various criteria.
3. **Sorting**: Results can be sorted by multiple fields in ascending or descending order.
4. **Soft Deletes**: Products are soft-deleted by default and can be restored.
5. **Relationships**: Product responses include related category, unit, and warehouse information when available.
6. **Calculated Fields**: Responses include calculated fields like `total_value`, `profit_margin`, and `is_low_stock`.

## Example API Client (JavaScript)

```javascript
class ProductAPI {
    constructor(baseURL, token) {
        this.baseURL = baseURL;
        this.token = token;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);
        return response.json();
    }

    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/products?${queryString}`);
    }

    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    async createProduct(data) {
        return this.request("/products", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateProduct(id, data) {
        return this.request(`/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async deleteProduct(id) {
        return this.request(`/products/${id}`, {
            method: "DELETE",
        });
    }

    async searchProducts(query, limit = 10) {
        return this.request(`/products/search/${query}?limit=${limit}`);
    }
}

// Usage
const api = new ProductAPI("http://your-domain.com/api", "your-token");
const products = await api.getProducts({ page: 1, per_page: 15 });
```

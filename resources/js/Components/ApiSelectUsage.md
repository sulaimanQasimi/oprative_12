# ApiSelect Component Usage Guide

## Overview

The `ApiSelect` component is a reusable, feature-rich select dropdown that fetches options from any API endpoint. It includes search functionality, icons, RTL/LTR support, and loading states.

## Features

- ✅ **API Integration**: Works with any API endpoint that returns value/label format
- ✅ **Search Functionality**: Built-in search with debouncing (300ms)
- ✅ **Icon Support**: Custom icons for better UX
- ✅ **RTL/LTR Support**: Full bidirectional text support
- ✅ **Loading States**: Shows loading indicator during API calls
- ✅ **Accessibility**: Keyboard navigation and click-outside-to-close
- ✅ **Error Handling**: Graceful error handling with fallbacks
- ✅ **Customizable**: Configurable styling and behavior

## Basic Usage

```jsx
import ApiSelect from '../Components/ApiSelect';

function MyComponent() {
    const [selectedValue, setSelectedValue] = useState(null);

    const handleChange = (value, option) => {
        setSelectedValue(value);
        console.log('Selected:', { value, option });
    };

    return (
        <ApiSelect
            apiEndpoint="/api/products/select"
            placeholder="Choose a product..."
            onChange={handleChange}
            value={selectedValue}
        />
    );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiEndpoint` | string | **required** | API endpoint that returns options |
| `placeholder` | string | "Select an option..." | Placeholder text when no option selected |
| `searchPlaceholder` | string | "Search..." | Placeholder for search input |
| `icon` | Component | null | Icon component to display |
| `direction` | string | "ltr" | Text direction ("ltr" or "rtl") |
| `onChange` | function | () => {} | Callback when selection changes |
| `value` | any | null | Currently selected value |
| `className` | string | "" | Additional CSS classes |
| `disabled` | boolean | false | Whether the select is disabled |
| `searchParam` | string | "search" | Query parameter name for search |
| `requireAuth` | boolean | false | Whether the endpoint requires authentication |
| `error` | string | null | Error message to display below the select |

## API Endpoint Requirements

Your API endpoint should return an array of objects with `value` and `label` properties. Optional `subtitle` and additional data can be included:

```json
[
  { 
    "value": 1, 
    "label": "Product Name 1",
    "subtitle": "Barcode: 123456789",
    "product": { "id": 1, "name": "Product Name 1", "barcode": "123456789" }
  },
  { 
    "value": 2, 
    "label": "Product Name 2",
    "subtitle": "ID: 2",
    "product": { "id": 2, "name": "Product Name 2", "barcode": null }
  }
]
```

### Example PHP Controller

```php
public function select(Request $request)
{
    $products = Product::where('name', 'like', '%' . $request->search . '%')
        ->orWhere('barcode', 'like', '%' . $request->search . '%')
        ->get();

    return $products->map(function ($product) {
        return [
            'value' => $product->id,
            'label' => $product->name,
        ];
    });
}
```

## Usage Examples

### With Icon

```jsx
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

<ApiSelect
    apiEndpoint="/api/products/select"
    placeholder="Choose a product..."
    icon={ShoppingBagIcon}
    onChange={handleChange}
/>
```

### RTL Support

```jsx
<ApiSelect
    apiEndpoint="/api/users/select"
    placeholder="اختر مستخدم..."
    searchPlaceholder="البحث..."
    direction="rtl"
    onChange={handleChange}
/>
```

### Custom Search Parameter

```jsx
<ApiSelect
    apiEndpoint="/api/customers/select"
    searchParam="query" // API will receive ?query=searchTerm
    onChange={handleChange}
/>
```

### Disabled State

```jsx
<ApiSelect
    apiEndpoint="/api/products/select"
    disabled={true}
    placeholder="This select is disabled"
/>
```

### Protected Endpoints (Authentication Required)

```jsx
<ApiSelect
    apiEndpoint="/api/protected/users/select"
    requireAuth={true}
    placeholder="Select user..."
    onChange={handleChange}
/>
```

**Note**: For protected endpoints, ensure you have:
- CSRF token in meta tag: `<meta name="csrf-token" content="{{ csrf_token() }}">`
- Authentication token in localStorage or meta tag

### With Error Handling (Form Validation)

```jsx
import { motion } from "framer-motion";
import { Package } from "lucide-react";

function ProductForm() {
    const [errors, setErrors] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(null);

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="space-y-3"
        >
            <label className="text-gray-700 dark:text-gray-300 font-semibold text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-green-500 dark:text-green-400" />
                Product *
            </label>
            <ApiSelect
                apiEndpoint="/api/products/select"
                placeholder="Select product"
                searchPlaceholder="Search products..."
                icon={Package}
                value={selectedProduct}
                onChange={(value, option) => {
                    setSelectedProduct(value);
                    // Clear error when user selects
                    if (errors.product_id) {
                        setErrors(prev => ({ ...prev, product_id: null }));
                    }
                }}
                error={errors.product_id}
                requireAuth={false}
            />
        </motion.div>
    );
}
```

## Styling

The component uses Tailwind CSS classes and can be customized by:

1. **Adding custom classes**: Use the `className` prop
2. **Modifying the component**: Edit the component file directly
3. **CSS overrides**: Use CSS specificity to override styles

```jsx
<ApiSelect
    apiEndpoint="/api/products/select"
    className="w-full max-w-sm border-red-500"
    onChange={handleChange}
/>
```

## Error Handling

The component handles errors gracefully:

- Network errors show "No options available"
- Empty results show "No results found"
- Loading states are indicated with a spinner

## Performance Notes

- Search requests are debounced by 300ms
- Component automatically closes when clicking outside
- API calls are cancelled if component unmounts during request

## Integration with Laravel

### 1. Create API Route

```php
// routes/api.php

// Public endpoint (no authentication required)
Route::get('products/select', [ProductController::class, 'select']);

// OR Protected endpoint (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('protected/users/select', [UserController::class, 'select']);
});
```

### 2. Create Controller Method

```php
// app/Http/Controllers/Api/ProductController.php
public function select(Request $request)
{
    $query = Product::query();
    
    if ($request->has('search')) {
        $search = $request->search;
        $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('code', 'like', "%{$search}%");
        });
    }
    
    return $query->get()->map(fn($item) => [
        'value' => $item->id,
        'label' => $item->name,
    ]);
}
```

### 3. Use in React Component

```jsx
// Public endpoint
<ApiSelect
    apiEndpoint="/api/products/select"
    placeholder="Select a product..."
    requireAuth={false}
    onChange={(value, option) => {
        setSelectedProduct(value);
    }}
/>

// Protected endpoint
<ApiSelect
    apiEndpoint="/api/protected/users/select"
    placeholder="Select a user..."
    requireAuth={true}
    onChange={(value, option) => {
        setSelectedUser(value);
    }}
/>
```

### 4. Authentication Setup (for protected endpoints)

Ensure your Laravel layout includes the CSRF token:

```blade
<!-- In your main layout file -->
<meta name="csrf-token" content="{{ csrf_token() }}">
```

For SPA applications, store the auth token:

```javascript
// After login, store the token
localStorage.setItem('auth_token', response.data.token);

// Or include it in a meta tag
<meta name="auth-token" content="{{ auth()->user()->createToken('api')->plainTextToken }}">
``` 
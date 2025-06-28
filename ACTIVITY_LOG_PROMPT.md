# Activity Log Implementation Prompt

Use this prompt to implement activity logging on any model in the Laravel application.

## Quick Implementation Prompt

```
I need to implement activity logging for the [MODEL_NAME] model in my Laravel application. Please help me:

1. **Model Setup**: Add activity logging to the [MODEL_NAME] model using Spatie ActivityLog package
   - Add LogsActivity trait
   - Configure getActivitylogOptions() method with appropriate settings
   - Use log name: '[model_name_lowercase]'
   - Exclude sensitive fields: [list any sensitive fields]
   - Set custom description: "This [model_name_lowercase] has been {eventName}"

2. **Controller Method**: Add activityLog method to [MODEL_NAME]Controller
   - Use 'view_[model_name_lowercase]' permission for authorization
   - Include pagination (20 per page)
   - Transform activities with readable changes
   - Include formatActivityChanges and formatFieldName helper methods
   - Custom field mappings for: [list model-specific fields]

3. **Route**: Add activity log route to routes/admin.php
   - Route: GET /{model}/activity-log
   - Name: admin.[model_name_plural].activity-log

4. **Frontend Component**: Create ActivityLog.jsx component
   - Use sky color scheme (matching existing design)
   - Based on Supplier/ActivityLog.jsx template
   - Update model icon to: [ICON_NAME]
   - Update route names and model references
   - Include proper back navigation

5. **Navigation Integration**: Add activity log button to [MODEL_NAME] show page

Please follow the existing patterns from the Supplier model implementation and use the comprehensive guide in docs/activity-log-implementation-guide.md as reference.

Model Details:
- Model Name: [MODEL_NAME]
- Fillable Fields: [LIST_FILLABLE_FIELDS]
- Sensitive Fields to Exclude: [LIST_SENSITIVE_FIELDS]
- Primary Display Field: [PRIMARY_FIELD] (e.g., 'name', 'title')
- Icon: [LUCIDE_ICON_NAME]
- Route Prefix: [ROUTE_PREFIX] (e.g., 'products', 'customers')
```

## Example Usage

Replace the placeholders with your model-specific information:

```
I need to implement activity logging for the Product model in my Laravel application. Please help me:

1. **Model Setup**: Add activity logging to the Product model using Spatie ActivityLog package
   - Add LogsActivity trait
   - Configure getActivitylogOptions() method with appropriate settings
   - Use log name: 'product'
   - Exclude sensitive fields: ['updated_at', 'last_synced_at']
   - Set custom description: "This product has been {eventName}"

2. **Controller Method**: Add activityLog method to ProductController
   - Use 'view_product' permission for authorization
   - Include pagination (20 per page)
   - Transform activities with readable changes
   - Include formatActivityChanges and formatFieldName helper methods
   - Custom field mappings for: ['name' => 'Product Name', 'sku' => 'SKU', 'price' => 'Price', 'category_id' => 'Category']

3. **Route**: Add activity log route to routes/admin.php
   - Route: GET /{product}/activity-log
   - Name: admin.products.activity-log

4. **Frontend Component**: Create ActivityLog.jsx component
   - Use sky color scheme (matching existing design)
   - Based on Supplier/ActivityLog.jsx template
   - Update model icon to: Package
   - Update route names and model references
   - Include proper back navigation

5. **Navigation Integration**: Add activity log button to Product show page

Model Details:
- Model Name: Product
- Fillable Fields: ['name', 'description', 'sku', 'price', 'category_id', 'status', 'stock_quantity']
- Sensitive Fields to Exclude: ['updated_at', 'last_synced_at']
- Primary Display Field: name
- Icon: Package
- Route Prefix: products
```

## Quick Checklist

After implementation, verify:
- [ ] Model has LogsActivity trait and proper configuration
- [ ] Controller has activityLog method with proper authorization
- [ ] Route is added and accessible
- [ ] Frontend component displays activity logs correctly
- [ ] Navigation link is added to show page
- [ ] Permissions are working correctly
- [ ] Activity logs are being created on CRUD operations
- [ ] Field names are properly formatted and readable
- [ ] Sensitive fields are excluded from logs

## Reference Files

- **Complete Guide**: `docs/activity-log-implementation-guide.md`
- **Example Implementation**: `app/Models/Supplier.php` and `app/Http/Controllers/Admin/SupplierController.php`
- **Frontend Template**: `resources/js/Pages/Admin/Supplier/ActivityLog.jsx` 
# Jalali Date Picker Integration Guide
## For Warehouse Outcome Date Range Filtering

## 🎯 Problem Solved
The controller now supports proper date range filtering with `from_date` and `to_date` parameters, compatible with Jalali date picker.

## 📋 Backend Changes Made

### Updated OutcomeController.php
```php
// Apply date range filters
if ($request->filled('from_date')) {
    $query->whereDate('created_at', '>=', $request->from_date);
}

if ($request->filled('to_date')) {
    $query->whereDate('created_at', '<=', $request->to_date);
}
```

### Filter Parameters
The controller now accepts:
- `from_date` - Start date (YYYY-MM-DD format)
- `to_date` - End date (YYYY-MM-DD format)
- Legacy: `year`, `month`, `day` (for backward compatibility)

## 🎨 Frontend Implementation

### 1. HTML Structure
Add the required attributes to your date input fields:

```html
<!-- From Date Input -->
<input 
    type="text" 
    data-jdp
    data-jdp-only-date
    id="from_date" 
    name="from_date"
    placeholder="از تاریخ"
    class="form-control"
    readonly
>

<!-- To Date Input -->
<input 
    type="text" 
    data-jdp
    data-jdp-only-date
    id="to_date" 
    name="to_date"
    placeholder="تا تاریخ"
    class="form-control"
    readonly
>
```

### 2. JavaScript Initialization
```javascript
// Initialize Jalali Date Picker
jalaliDatepicker.startWatch({
    date: true,                    // Enable date selection
    time: false,                   // Disable time selection
    autoShow: true,                // Auto show on focus
    autoHide: true,                // Auto hide on outside click
    hideAfterChange: true,         // Hide after date selection
    persianDigits: true,           // Use Persian digits
    showTodayBtn: true,            // Show "Today" button
    showEmptyBtn: true,            // Show "Clear" button
    autoReadOnlyInput: true,       // Make inputs readonly
    
    // Optional: Set date constraints
    minDate: null,                 // No minimum date
    maxDate: 'today',              // Maximum date is today
    
    // Custom separator
    separatorChars: {
        date: '/',
        between: ' ',
        time: ':'
    }
});
```

### 3. Event Handling & Form Submission
```javascript
// Function to convert Jalali date to Gregorian (YYYY-MM-DD)
function jalaliToGregorian(jalaliDate) {
    // You'll need a conversion library like moment-jalaali
    // Example using moment-jalaali:
    // return moment(jalaliDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
    
    // Or use your preferred conversion method
    return jalaliDate; // Placeholder - implement actual conversion
}

// Handle date change events
document.addEventListener('DOMContentLoaded', function() {
    const fromDateInput = document.getElementById('from_date');
    const toDateInput = document.getElementById('to_date');
    
    // Listen for date changes
    fromDateInput.addEventListener('change', function() {
        updateFilters();
    });
    
    toDateInput.addEventListener('change', function() {
        updateFilters();
    });
});

// Update filters function
function updateFilters() {
    const fromDate = document.getElementById('from_date').value;
    const toDate = document.getElementById('to_date').value;
    const search = document.querySelector('[name="search"]').value;
    
    // Convert Jalali dates to Gregorian for backend
    const gregorianFromDate = fromDate ? jalaliToGregorian(fromDate) : '';
    const gregorianToDate = toDate ? jalaliToGregorian(toDate) : '';
    
    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (gregorianFromDate) params.append('from_date', gregorianFromDate);
    if (gregorianToDate) params.append('to_date', gregorianToDate);
    
    // Redirect with filters
    window.location.href = window.location.pathname + '?' + params.toString();
}
```

### 4. Vue.js/Inertia.js Integration
If you're using Vue.js with Inertia:

```vue
<template>
    <div>
        <!-- Date Range Inputs -->
        <div class="date-range">
            <input 
                ref="fromDate"
                data-jdp
                data-jdp-only-date
                v-model="filters.from_date_display"
                @input="handleDateChange"
                placeholder="از تاریخ"
                readonly
            />
            
            <input 
                ref="toDate"
                data-jdp
                data-jdp-only-date
                v-model="filters.to_date_display"
                @input="handleDateChange"
                placeholder="تا تاریخ"
                readonly
            />
        </div>
        
        <!-- Other filters... -->
    </div>
</template>

<script>
import { router } from '@inertiajs/vue3'

export default {
    props: {
        filters: Object,
        // other props...
    },
    
    data() {
        return {
            form: {
                search: this.filters.search || '',
                from_date: this.filters.from_date || '',
                to_date: this.filters.to_date || '',
                from_date_display: '',
                to_date_display: ''
            }
        }
    },
    
    mounted() {
        // Initialize date picker
        jalaliDatepicker.startWatch({
            date: true,
            time: false,
            persianDigits: true,
            autoReadOnlyInput: true,
            hideAfterChange: true,
            showTodayBtn: true,
            showEmptyBtn: true
        });
        
        // Convert existing Gregorian dates to Jalali for display
        if (this.filters.from_date) {
            this.form.from_date_display = this.gregorianToJalali(this.filters.from_date);
        }
        if (this.filters.to_date) {
            this.form.to_date_display = this.gregorianToJalali(this.filters.to_date);
        }
    },
    
    methods: {
        handleDateChange() {
            // Convert Jalali to Gregorian
            this.form.from_date = this.form.from_date_display ? 
                this.jalaliToGregorian(this.form.from_date_display) : '';
            this.form.to_date = this.form.to_date_display ? 
                this.jalaliToGregorian(this.form.to_date_display) : '';
            
            // Apply filters
            this.applyFilters();
        },
        
        applyFilters() {
            router.get(route('warehouse.outcomes.index'), {
                search: this.form.search,
                from_date: this.form.from_date,
                to_date: this.form.to_date
            }, {
                preserveState: true,
                replace: true
            });
        },
        
        jalaliToGregorian(jalaliDate) {
            // Implement conversion logic
            // Example with moment-jalaali:
            // return moment(jalaliDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
            return jalaliDate; // Placeholder
        },
        
        gregorianToJalali(gregorianDate) {
            // Implement conversion logic
            // Example with moment-jalaali:
            // return moment(gregorianDate).format('jYYYY/jMM/jDD');
            return gregorianDate; // Placeholder
        }
    }
}
</script>
```

## 📅 Date Conversion Libraries

### Recommended Libraries for Date Conversion:

1. **moment-jalaali** (Most popular)
```javascript
// Install: npm install moment-jalaali
import moment from 'moment-jalaali'

// Convert Jalali to Gregorian
const gregorian = moment('1402/03/15', 'jYYYY/jMM/jDD').format('YYYY-MM-DD');

// Convert Gregorian to Jalali
const jalali = moment('2023-06-05').format('jYYYY/jMM/jDD');
```

2. **persian-date**
```javascript
// Install: npm install persian-date
import PersianDate from 'persian-date'

const pDate = new PersianDate();
// Conversion methods available
```

3. **dayjs with jalali plugin**
```javascript
// Install: npm install dayjs dayjs-plugin-jalali
import dayjs from 'dayjs'
import jalali from 'dayjs-plugin-jalali'

dayjs.extend(jalali)
// Use jalali calendar
```

## 🔧 Complete Working Example

```html
<!DOCTYPE html>
<html>
<head>
    <script src="path/to/jalali-datepicker.js"></script>
    <script src="path/to/moment-jalaali.js"></script>
</head>
<body>
    <form id="filterForm">
        <input data-jdp id="from_date" placeholder="از تاریخ" readonly>
        <input data-jdp id="to_date" placeholder="تا تاریخ" readonly>
        <button type="submit">فیلتر</button>
    </form>

    <script>
        // Initialize date picker
        jalaliDatepicker.startWatch({
            date: true,
            time: false,
            persianDigits: true,
            hideAfterChange: true
        });
        
        // Handle form submission
        document.getElementById('filterForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fromDate = document.getElementById('from_date').value;
            const toDate = document.getElementById('to_date').value;
            
            // Convert to Gregorian format
            const fromDateGregorian = fromDate ? 
                moment(fromDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD') : '';
            const toDateGregorian = toDate ? 
                moment(toDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD') : '';
            
            // Submit to backend
            const params = new URLSearchParams();
            if (fromDateGregorian) params.append('from_date', fromDateGregorian);
            if (toDateGregorian) params.append('to_date', toDateGregorian);
            
            window.location.href = '/warehouse/outcomes?' + params.toString();
        });
    </script>
</body>
</html>
```

## ✅ Testing the Implementation

1. **Backend Test**: Make sure these URLs work:
   - `/warehouse/outcomes?from_date=2023-06-01&to_date=2023-06-30`
   - `/warehouse/outcomes?from_date=2023-06-01`
   - `/warehouse/outcomes?to_date=2023-06-30`

2. **Frontend Test**: 
   - Date picker should show in Jalali calendar
   - Selecting dates should update the input values
   - Form submission should send Gregorian dates to backend

## 🚀 Summary

Your `OutcomeController` now supports:
- ✅ Date range filtering with `from_date` and `to_date`
- ✅ Backward compatibility with existing filters
- ✅ Proper SQL date comparison
- ✅ Ready for Jalali date picker integration

The key is to convert Jalali dates to Gregorian format (YYYY-MM-DD) before sending to the backend, while displaying Jalali dates to users in the frontend. 
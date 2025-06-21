# Alert Component Documentation

## Overview
A flexible alert component for displaying important messages, notifications, and status updates with different variants and styling options.

## Import
```jsx
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
```

## Basic Usage

### Default Alert
```jsx
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";

function BasicAlert() {
  return (
    <Alert>
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is a basic alert message for general information.
      </AlertDescription>
    </Alert>
  );
}
```

### Destructive Alert
```jsx
function ErrorAlert() {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong. Please try again later.
      </AlertDescription>
    </Alert>
  );
}
```

### Alert with Icons
```jsx
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

function AlertWithIcons() {
  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Your profile has been updated successfully.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          This action cannot be undone. Please proceed with caution.
        </AlertDescription>
      </Alert>
    </div>
  );
}
```

### Form Validation Alerts
```jsx
function FormAlert({ errors }) {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Validation Errors</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1">
          {Object.values(errors).map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
```

### Success Message Alert
```jsx
function SuccessAlert({ message, onClose }) {
  return (
    <Alert className="border-green-200 bg-green-50 text-green-800">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        {message}
        {onClose && (
          <button
            onClick={onClose}
            className="text-green-600 hover:text-green-800"
          >
            ×
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
```

## API Reference

### Alert Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'destructive'` | `'default'` | Visual variant of the alert |
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Alert content |

### AlertTitle Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Title content |

### AlertDescription Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Description content |

## Variants

### Default
- Light background with subtle border
- Suitable for general information

### Destructive
- Red color scheme
- For errors, warnings, and critical messages

## Styling Examples

### Custom Colors
```jsx
// Custom success alert
<Alert className="border-green-200 bg-green-50 text-green-800">
  <AlertTitle className="text-green-900">Success</AlertTitle>
  <AlertDescription>Operation completed successfully.</AlertDescription>
</Alert>

// Custom warning alert
<Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
  <AlertTitle className="text-yellow-900">Warning</AlertTitle>
  <AlertDescription>Please review your input.</AlertDescription>
</Alert>
```

## Best Practices

1. **Use appropriate variants** for the message type
2. **Include clear, actionable titles**
3. **Keep descriptions concise but informative**
4. **Add icons** to improve visual hierarchy
5. **Consider dismissible alerts** for temporary messages
6. **Use consistent styling** across your application 
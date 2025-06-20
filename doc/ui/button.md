# Button Component Documentation

## Overview
A versatile button component with multiple variants, sizes, and states for various use cases throughout your application.

## Import
```jsx
import { Button } from "@/Components/ui/button";
```

## Basic Usage

### Default Button
```jsx
import { Button } from "@/Components/ui/button";

function BasicButton() {
  return (
    <Button onClick={() => alert('Clicked!')}>
      Click me
    </Button>
  );
}
```

### Button Variants
```jsx
function ButtonVariants() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
```

### Button Sizes
```jsx
function ButtonSizes() {
  return (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🎯</Button>
    </div>
  );
}
```

### Buttons with Icons
```jsx
import { Plus, Download, Trash2, Edit } from "lucide-react";

function ButtonsWithIcons() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
      
      <Button variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
      
      <Button variant="destructive">
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
      
      <Button size="icon" variant="ghost">
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

### Loading States
```jsx
import { Loader2 } from "lucide-react";

function LoadingButton({ isLoading, ...props }) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {isLoading ? 'Loading...' : 'Submit'}
    </Button>
  );
}
```

### Form Buttons
```jsx
import { useForm } from '@inertiajs/react';

function FormButtons() {
  const { processing } = useForm();

  return (
    <div className="flex gap-2">
      <Button type="submit" disabled={processing}>
        {processing ? 'Saving...' : 'Save'}
      </Button>
      <Button type="button" variant="outline">
        Cancel
      </Button>
    </div>
  );
}
```

### Button as Link
```jsx
import { Link } from '@inertiajs/react';

function ButtonAsLink() {
  return (
    <Button asChild>
      <Link href="/profile">
        View Profile
      </Link>
    </Button>
  );
}
```

### Button Groups
```jsx
function ButtonGroup() {
  return (
    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
      <Button variant="ghost" className="rounded-none border-r">
        Option 1
      </Button>
      <Button variant="ghost" className="rounded-none border-r">
        Option 2
      </Button>
      <Button variant="ghost" className="rounded-none">
        Option 3
      </Button>
    </div>
  );
}
```

## API Reference

### Button Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'` | `'default'` | Visual variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `asChild` | `boolean` | `false` | Render as child element (using Slot) |
| `className` | `string` | `""` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `children` | `ReactNode` | `undefined` | Button content |

## Variants

### Default
- Purple background with white text
- Primary action button

### Destructive
- Red background for dangerous actions
- Use for delete, remove operations

### Outline
- Transparent background with border
- Secondary actions

### Ghost
- Transparent background, no border
- Subtle actions, toolbar buttons

### Link
- Styled as a link with underline
- Navigation or external links

## Sizes

### Small (`sm`)
- Compact button for tight spaces
- Height: 32px (h-8)

### Default
- Standard button size
- Height: 40px (h-10)

### Large (`lg`)
- Prominent button for main actions
- Height: 48px (h-12)

### Icon
- Square button for icons only
- Size: 40x40px (h-10 w-10)

## Best Practices

1. **Use primary buttons sparingly** - typically one per page section
2. **Choose appropriate variants** for action hierarchy
3. **Include loading states** for async operations
4. **Provide clear, action-oriented labels**
5. **Use consistent sizing** within the same context
6. **Add icons** to improve recognition and usability
7. **Ensure sufficient contrast** for accessibility

## Common Patterns

### Confirmation Dialog Buttons
```jsx
function ConfirmationButtons({ onConfirm, onCancel, isLoading }) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel} disabled={isLoading}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
        {isLoading ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  );
}
```

### Toolbar Buttons
```jsx
function Toolbar() {
  return (
    <div className="flex items-center gap-1 p-2 border rounded-lg">
      <Button size="icon" variant="ghost">
        <Bold className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <Italic className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <Underline className="h-4 w-4" />
      </Button>
    </div>
  );
}
``` 
# Badge Component Documentation

## Overview
A small status indicator component for displaying labels, categories, notifications, and other contextual information with various styling variants.

## Import
```jsx
import { Badge } from "@/Components/ui/badge";
```

## Basic Usage

### Default Badge
```jsx
import { Badge } from "@/Components/ui/badge";

function BasicBadge() {
  return <Badge>Default</Badge>;
}
```

### Badge Variants
```jsx
function BadgeVariants() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}
```

### Status Badges
```jsx
function StatusBadges() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span>Order Status:</span>
        <Badge variant="success">Completed</Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <span>Payment:</span>
        <Badge variant="warning">Pending</Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <span>Shipment:</span>
        <Badge variant="danger">Failed</Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <span>User Role:</span>
        <Badge variant="primary">Admin</Badge>
      </div>
    </div>
  );
}
```

### Badges with Icons
```jsx
import { Check, Clock, X, AlertTriangle, Star } from "lucide-react";

function BadgesWithIcons() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="success" className="flex items-center gap-1">
        <Check className="h-3 w-3" />
        Approved
      </Badge>
      
      <Badge variant="warning" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
      
      <Badge variant="danger" className="flex items-center gap-1">
        <X className="h-3 w-3" />
        Rejected
      </Badge>
      
      <Badge variant="outline" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Review
      </Badge>
      
      <Badge variant="primary" className="flex items-center gap-1">
        <Star className="h-3 w-3" />
        Featured
      </Badge>
    </div>
  );
}
```

### Notification Badges
```jsx
function NotificationBadges() {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative">
        <Bell className="h-6 w-6" />
        <Badge 
          variant="danger" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          3
        </Badge>
      </div>
      
      <div className="relative">
        <Mail className="h-6 w-6" />
        <Badge 
          variant="primary" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          12
        </Badge>
      </div>
      
      <div className="relative">
        <ShoppingCart className="h-6 w-6" />
        <Badge 
          variant="success" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          5
        </Badge>
      </div>
    </div>
  );
}
```

### Dynamic Status Badge
```jsx
function getStatusBadge(status) {
  const statusConfig = {
    active: { variant: "success", label: "Active" },
    inactive: { variant: "secondary", label: "Inactive" },
    pending: { variant: "warning", label: "Pending" },
    suspended: { variant: "danger", label: "Suspended" },
    draft: { variant: "outline", label: "Draft" },
  };

  const config = statusConfig[status] || statusConfig.inactive;
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}

function UserStatusBadge({ user }) {
  return (
    <div className="flex items-center gap-2">
      <span>{user.name}</span>
      {getStatusBadge(user.status)}
    </div>
  );
}
```

### Priority Badges
```jsx
function PriorityBadge({ priority }) {
  const priorityConfig = {
    low: { variant: "outline", className: "text-gray-600 border-gray-300" },
    medium: { variant: "warning", className: "" },
    high: { variant: "primary", className: "" },
    urgent: { variant: "danger", className: "animate-pulse" },
  };

  const config = priorityConfig[priority] || priorityConfig.low;

  return (
    <Badge 
      variant={config.variant} 
      className={config.className}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
    </Badge>
  );
}

function TaskList({ tasks }) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between p-2 border rounded">
          <span>{task.title}</span>
          <PriorityBadge priority={task.priority} />
        </div>
      ))}
    </div>
  );
}
```

### Category Badges
```jsx
function CategoryBadges({ categories }) {
  const categoryColors = {
    technology: "bg-blue-100 text-blue-800 border-blue-200",
    design: "bg-purple-100 text-purple-800 border-purple-200",
    marketing: "bg-green-100 text-green-800 border-green-200",
    sales: "bg-orange-100 text-orange-800 border-orange-200",
    support: "bg-pink-100 text-pink-800 border-pink-200",
  };

  return (
    <div className="flex gap-1 flex-wrap">
      {categories.map((category) => (
        <Badge 
          key={category}
          variant="outline"
          className={categoryColors[category] || ""}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}
```

### Interactive Badges (Removable Tags)
```jsx
import { X } from "lucide-react";

function RemovableBadge({ children, onRemove, ...props }) {
  return (
    <Badge 
      {...props}
      className={`pr-1 ${props.className || ''}`}
    >
      {children}
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-black/20 rounded-full p-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

function TagList({ tags, onRemoveTag }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {tags.map((tag) => (
        <RemovableBadge
          key={tag.id}
          variant="outline"
          onRemove={() => onRemoveTag(tag.id)}
        >
          {tag.name}
        </RemovableBadge>
      ))}
    </div>
  );
}
```

## API Reference

### Badge Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'outline'` | `'default'` | Visual variant |
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Badge content |

## Variants

### Default
- Dark background with white text
- General purpose badge

### Primary  
- Indigo/blue background
- Important information or primary status

### Success
- Green background
- Positive status, completed items

### Warning
- Yellow/orange background  
- Warnings, pending items

### Danger
- Red background
- Errors, critical status

### Outline
- Transparent background with border
- Subtle labeling

## Styling Examples

### Custom Badge Styles
```jsx
// Large badge
<Badge className="text-base px-3 py-1">Large Badge</Badge>

// Small badge
<Badge className="text-xs px-1.5 py-0.5">Small</Badge>

// Rounded badge
<Badge className="rounded-full">Rounded</Badge>

// Custom colors
<Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
  Gradient
</Badge>

// Dotted badge
<Badge variant="outline" className="border-dashed">
  Dotted
</Badge>
```

## Best Practices

1. **Use appropriate variants** for semantic meaning
2. **Keep text concise** - badges are for quick scanning
3. **Be consistent** with color usage across your app
4. **Consider accessibility** - ensure sufficient contrast
5. **Use icons sparingly** to avoid clutter
6. **Test on different screen sizes**
7. **Group related badges** logically

## Common Use Cases

### Table Status Column
```jsx
function UserTable({ users }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>
              <Badge variant={user.active ? "success" : "outline"}>
                {user.active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="primary">{user.role}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Filter Tags
```jsx
function FilterBadges({ activeFilters, onRemoveFilter }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {activeFilters.map((filter) => (
        <Badge 
          key={filter.id}
          variant="outline" 
          className="cursor-pointer hover:bg-gray-100"
          onClick={() => onRemoveFilter(filter.id)}
        >
          {filter.label}
          <X className="h-3 w-3 ml-1" />
        </Badge>
      ))}
    </div>
  );
}
``` 
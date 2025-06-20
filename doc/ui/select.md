# Select Component Documentation

## Overview
A custom select component built with React that provides a dropdown selection interface with search and keyboard navigation support.

## Import
```jsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";
```

## Basic Usage

### Simple Select
```jsx
import React, { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";

function BasicSelect() {
  const [value, setValue] = useState("");

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### Select with Labels
```jsx
import { Label } from "@/Components/ui/label";

function LabeledSelect() {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-2">
      <Label htmlFor="country">Country</Label>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger id="country">
          <SelectValue placeholder="Select a country..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

### Select with Complex Items (Icons, Descriptions)
```jsx
import { User, Mail, Phone } from "lucide-react";

function ComplexSelect() {
  const [selectedUser, setSelectedUser] = useState("");

  const users = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "Manager" },
  ];

  // Find selected user for display
  const selectedUserData = users.find(user => user.id === selectedUser);

  return (
    <Select value={selectedUser} onValueChange={setSelectedUser}>
      <SelectTrigger className="w-full">
        <SelectValue>
          {selectedUserData ? selectedUserData.name : "Select a user..."}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4" />
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                {user.role}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Form Integration
```jsx
import { useForm } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";

function FormWithSelect() {
  const { data, setData, post, errors } = useForm({
    category: '',
    priority: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/submit');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={data.category} onValueChange={(value) => setData('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
        {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## API Reference

### Select Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | The current selected value |
| `onValueChange` | `(value: string) => void` | `undefined` | Callback when selection changes |
| `children` | `ReactNode` | `undefined` | Select trigger and content components |

### SelectTrigger Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Usually contains SelectValue |

### SelectValue Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `""` | Placeholder text when no value selected |
| `className` | `string` | `""` | Additional CSS classes |

### SelectContent Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | SelectItem components |

### SelectItem Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | The value of this option |
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Content to display |

## Styling

### Custom Styling
```jsx
// Custom trigger styling
<SelectTrigger className="border-2 border-blue-500 rounded-lg">
  <SelectValue placeholder="Custom styled select..." />
</SelectTrigger>

// Custom content styling
<SelectContent className="max-h-60 overflow-y-auto">
  {/* items */}
</SelectContent>

// Custom item styling
<SelectItem 
  value="special" 
  className="bg-blue-50 hover:bg-blue-100 text-blue-900"
>
  Special Option
</SelectItem>
```

## Best Practices

1. **Always provide a placeholder** for better UX
2. **Use meaningful values** for form submission
3. **Handle empty states** gracefully
4. **Provide clear labels** for accessibility
5. **Consider loading states** for dynamic data
6. **Implement search** for large option lists
7. **Use consistent styling** across your application

## Accessibility Features

- Full keyboard navigation support
- ARIA attributes for screen readers
- Focus management
- Proper role definitions
- Accessible state indicators 
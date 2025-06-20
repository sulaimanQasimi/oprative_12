# Input Component Documentation

## Overview
A styled text input component with consistent design and accessibility features, supporting various input types and states.

## Import
```jsx
import { Input } from "@/Components/ui/input";
```

## Basic Usage

### Default Input
```jsx
import { Input } from "@/Components/ui/input";

function BasicInput() {
  return (
    <Input placeholder="Enter text..." />
  );
}
```

### Input with Label
```jsx
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

function LabeledInput() {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input 
        id="email" 
        type="email" 
        placeholder="Enter your email" 
      />
    </div>
  );
}
```

### Different Input Types
```jsx
function InputTypes() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Text</Label>
        <Input id="text" type="text" placeholder="Text input" />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="email@example.com" />
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Password" />
      </div>
      
      <div>
        <Label htmlFor="number">Number</Label>
        <Input id="number" type="number" placeholder="123" />
      </div>
      
      <div>
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" />
      </div>
      
      <div>
        <Label htmlFor="file">File</Label>
        <Input id="file" type="file" />
      </div>
    </div>
  );
}
```

### Form Integration
```jsx
import { useForm } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";

function FormWithInput() {
  const { data, setData, post, errors } = useForm({
    name: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/contact');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          className={errors.name ? 'border-red-500' : ''}
          placeholder="Enter your full name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          className={errors.email ? 'border-red-500' : ''}
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => setData('phone', e.target.value)}
          placeholder="(555) 123-4567"
        />
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Input with Icons
```jsx
import { Search, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function InputWithIcons() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          placeholder="Search..." 
          className="pl-10"
        />
      </div>

      {/* Email Input */}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          type="email"
          placeholder="Email address" 
          className="pl-10"
        />
      </div>

      {/* Password Input with Toggle */}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          type={showPassword ? "text" : "password"}
          placeholder="Password" 
          className="pl-10 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
```

### Input States
```jsx
function InputStates() {
  return (
    <div className="space-y-4">
      {/* Normal */}
      <Input placeholder="Normal input" />
      
      {/* Disabled */}
      <Input placeholder="Disabled input" disabled />
      
      {/* Error state */}
      <Input 
        placeholder="Error input" 
        className="border-red-500 focus-visible:ring-red-500" 
      />
      
      {/* Success state */}
      <Input 
        placeholder="Success input" 
        className="border-green-500 focus-visible:ring-green-500" 
      />
      
      {/* Read-only */}
      <Input 
        value="Read-only value" 
        readOnly 
        className="bg-gray-50" 
      />
    </div>
  );
}
```

### Input Validation
```jsx
import { useState } from 'react';

function ValidatedInput() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setError('Email is required');
    } else if (!emailRegex.test(value)) {
      setError('Please enter a valid email');
    } else {
      setError('');
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  return (
    <div>
      <Label htmlFor="validated-email">Email Address</Label>
      <Input
        id="validated-email"
        type="email"
        value={email}
        onChange={handleChange}
        onBlur={() => validateEmail(email)}
        className={error ? 'border-red-500' : email && !error ? 'border-green-500' : ''}
        placeholder="Enter your email"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {email && !error && <p className="text-green-500 text-sm mt-1">Valid email format</p>}
    </div>
  );
}
```

## API Reference

### Input Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `"text"` | HTML input type |
| `className` | `string` | `""` | Additional CSS classes |
| `placeholder` | `string` | `""` | Placeholder text |
| `disabled` | `boolean` | `false` | Whether input is disabled |
| `readOnly` | `boolean` | `false` | Whether input is read-only |
| `value` | `string` | `undefined` | Controlled value |
| `onChange` | `(event) => void` | `undefined` | Change handler |
| `onBlur` | `(event) => void` | `undefined` | Blur handler |
| `onFocus` | `(event) => void` | `undefined` | Focus handler |

All standard HTML input attributes are also supported.

## Styling

### Custom Styles
```jsx
// Error state
<Input className="border-red-500 focus-visible:ring-red-500" />

// Success state  
<Input className="border-green-500 focus-visible:ring-green-500" />

// Large input
<Input className="h-12 text-lg" />

// Small input
<Input className="h-8 text-sm" />

// Full width
<Input className="w-full" />

// With custom background
<Input className="bg-gray-50 border-gray-300" />
```

## Best Practices

1. **Always use labels** for accessibility
2. **Provide clear placeholder text**
3. **Handle validation gracefully**
4. **Use appropriate input types**
5. **Show clear error states**
6. **Consider loading states** for async validation
7. **Test keyboard navigation**
8. **Ensure proper contrast** for readability

## Common Patterns

### Search Input
```jsx
function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..." 
        className="pl-10 pr-10"
      />
      <Button 
        type="submit"
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2"
      >
        Search
      </Button>
    </form>
  );
}
``` 
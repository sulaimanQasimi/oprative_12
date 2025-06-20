# UI Components Documentation

This directory contains comprehensive documentation for all UI components in the `@/Components/ui` directory.

## Available Components

### Form Components
- [Select](./select.md) - Dropdown selection component with search support
- [Input](./input.md) - Text input with validation styling
- [Textarea](./textarea.md) - Multi-line text input
- [Label](./label.md) - Form field labels with accessibility features
- [Checkbox](./checkbox.md) - Checkbox input with custom styling
- [Switch](./switch.md) - Toggle switch component

### Layout Components
- [Card](./card.md) - Container with header, content, and footer sections
- [Separator](./separator.md) - Visual divider for content sections
- [Tabs](./tabs.md) - Tabbed navigation interface

### Feedback Components
- [Alert](./alert.md) - Status messages and notifications
- [Badge](./badge.md) - Status indicators and labels
- [Avatar](./avatar.md) - User profile images with fallbacks

### Interactive Components
- [Button](./button.md) - Clickable actions with multiple variants
- [Dialog](./dialog.md) - Modal dialogs and overlays
- [Dropdown Menu](./dropdown-menu.md) - Context menus and action lists

### Data Display
- [Table](./table.md) - Structured data display with sorting and styling

## Quick Start

All components follow consistent patterns:

```jsx
// Import the component
import { ComponentName } from "@/Components/ui/component-name";

// Use with props
<ComponentName prop="value">
  Content
</ComponentName>
```

## Common Props

Most components share these common props:

- `className` - Additional CSS classes for customization
- `children` - Child elements or content
- Standard HTML attributes (when applicable)

## Styling

Components use Tailwind CSS classes and can be customized by:

1. **Adding custom classes** via the `className` prop
2. **Modifying the base component** for global changes
3. **Using CSS variables** for theming

## Best Practices

1. **Import only what you need** for better bundle size
2. **Use semantic HTML** when possible
3. **Follow accessibility guidelines** 
4. **Maintain consistent spacing** using Tailwind utilities
5. **Test with keyboard navigation**
6. **Provide meaningful labels** for form components

## Examples

### Basic Form
```jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

function ContactForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" />
        </div>
        
        <div>
          <Label htmlFor="country">Country</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="w-full">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### Data Display
```jsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

function UserTable({ users }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              {user.name}
            </TableCell>
            <TableCell>
              <Badge variant={user.active ? "success" : "secondary"}>
                {user.active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>{user.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## Contributing

When adding new components:

1. Create a new `.md` file in this directory
2. Follow the established documentation format
3. Include comprehensive examples
4. Document all props and variants
5. Add to this README index 
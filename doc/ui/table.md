# Table Component Documentation

## Overview
A comprehensive table component for displaying structured data with proper styling, accessibility, and responsive design features.

## Import
```jsx
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter, 
  TableRow, 
  TableHead, 
  TableCell, 
  TableCaption 
} from "@/Components/ui/table";
```

## Basic Usage

### Simple Table
```jsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/Components/ui/table";

function BasicTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
```

### Table with Caption
```jsx
function TableWithCaption() {
  return (
    <Table>
      <TableCaption>A list of recent users and their information.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>001</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
```

### Data Table with Actions
```jsx
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";

function UsersTable({ users }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Table with Footer
```jsx
function InvoiceTable({ items }) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>${item.price}</TableCell>
            <TableCell className="text-right">${item.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right font-medium">${total}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
```

### Sortable Table
```jsx
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

function SortableTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const SortButton = ({ column, children }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center gap-1 hover:text-gray-900"
    >
      {children}
      {sortConfig.key === column ? (
        sortConfig.direction === 'asc' ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )
      ) : (
        <ChevronUp className="h-4 w-4 opacity-0" />
      )}
    </button>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <SortButton column="name">Name</SortButton>
          </TableHead>
          <TableHead>
            <SortButton column="email">Email</SortButton>
          </TableHead>
          <TableHead>
            <SortButton column="createdAt">Created</SortButton>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Selectable Table
```jsx
import { Checkbox } from "@/Components/ui/checkbox";

function SelectableTable({ data }) {
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows(
      selectedRows.length === data.length ? [] : data.map(item => item.id)
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox 
              checked={selectedRows.length === data.length}
              onCheckedChange={toggleAll}
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow 
            key={item.id}
            className={selectedRows.includes(item.id) ? 'bg-blue-50' : ''}
          >
            <TableCell>
              <Checkbox 
                checked={selectedRows.includes(item.id)}
                onCheckedChange={() => toggleRow(item.id)}
              />
            </TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>
              <Badge variant={item.active ? 'success' : 'secondary'}>
                {item.active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Responsive Table
```jsx
function ResponsiveTable({ data }) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Name</TableHead>
            <TableHead className="min-w-[200px]">Email</TableHead>
            <TableHead className="min-w-[100px]">Role</TableHead>
            <TableHead className="min-w-[120px]">Status</TableHead>
            <TableHead className="min-w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.role}</TableCell>
              <TableCell>
                <Badge variant={item.active ? 'success' : 'secondary'}>
                  {item.active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

## API Reference

### Table Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Table content |

### TableHeader Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Header rows |

### TableBody Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Body rows |

### TableFooter Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Footer rows |

### TableRow Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Row cells |

### TableHead Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Header content |

### TableCell Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Cell content |

### TableCaption Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Caption text |

## Best Practices

1. **Use semantic structure** with proper header, body, and footer sections
2. **Include table captions** for accessibility
3. **Make tables responsive** with horizontal scrolling on small screens
4. **Use consistent alignment** (left for text, right for numbers)
5. **Provide visual feedback** for interactive elements
6. **Consider pagination** for large datasets
7. **Include loading states** for async data
8. **Use proper contrast** for readability

## Common Patterns

### Loading State
```jsx
function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Empty State
```jsx
function EmptyTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="text-center py-8 text-gray-500">
            No data available
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
``` 
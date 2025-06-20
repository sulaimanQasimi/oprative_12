# Dialog Component Documentation

## Overview
A modal dialog component for overlaying content on top of the main page, perfect for confirmations, forms, and detailed information display.

## Import
```jsx
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/Components/ui/dialog";
```

## Basic Usage

### Simple Dialog
```jsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

function BasicDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <p>This is the dialog content.</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### Dialog with Description
```jsx
function DescriptiveDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### Confirmation Dialog
```jsx
function ConfirmationDialog({ open, onOpenChange, onConfirm, title, description }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Usage
function DeleteUserButton({ user }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    // Delete user logic
    await deleteUser(user.id);
  };

  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => setShowConfirm(true)}
      >
        Delete User
      </Button>
      
      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
      />
    </>
  );
}
```

### Form Dialog
```jsx
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/projects', {
      onSuccess: () => {
        setOpen(false);
        reset();
      }
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create Project</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Enter the details for your new project below.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
                placeholder="Enter project name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### Dialog with Trigger
```jsx
function DialogWithTrigger() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="notifications">Email Notifications</Label>
            <Switch id="notifications" />
          </div>
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Large Content Dialog
```jsx
function LargeContentDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>View Details</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              Complete information about this project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">Overview</h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit...
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">Team Members</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Team member cards */}
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2">Timeline</h3>
              {/* Timeline content */}
            </section>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button>Edit Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### Alert Dialog
```jsx
function AlertDialog({ open, onOpenChange, title, description, action, actionLabel = "Continue" }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={action}>
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## API Reference

### Dialog Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether the dialog is open |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback when open state changes |
| `children` | `ReactNode` | `undefined` | Dialog content |

### DialogContent Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Content inside dialog |

### DialogHeader Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Header content |

### DialogFooter Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Footer content (usually buttons) |

### DialogTitle Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Title text |

### DialogDescription Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `children` | `ReactNode` | `undefined` | Description text |

### DialogTrigger Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render as child element |
| `children` | `ReactNode` | `undefined` | Trigger element |

## Best Practices

1. **Use descriptive titles** that clearly indicate the dialog's purpose
2. **Provide clear actions** in the footer (Cancel/Confirm pattern)
3. **Handle escape key** and backdrop clicks for closing
4. **Focus management** - return focus to trigger element on close
5. **Limit dialog size** for better mobile experience
6. **Use loading states** for async operations
7. **Prevent body scroll** when dialog is open
8. **Test keyboard navigation** for accessibility

## Common Patterns

### Multi-step Dialog
```jsx
function MultiStepDialog() {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Setup Wizard - Step {step} of 3</DialogTitle>
        </DialogHeader>
        
        {step === 1 && <Step1Component />}
        {step === 2 && <Step2Component />}
        {step === 3 && <Step3Component />}
        
        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button onClick={() => setOpen(false)}>Finish</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Nested Dialogs
```jsx
// Generally avoid nested dialogs, but if needed:
function NestedDialogExample() {
  const [primaryOpen, setPrimaryOpen] = useState(false);
  const [secondaryOpen, setSecondaryOpen] = useState(false);

  return (
    <>
      <Dialog open={primaryOpen} onOpenChange={setPrimaryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Primary Dialog</DialogTitle>
          </DialogHeader>
          <Button onClick={() => setSecondaryOpen(true)}>
            Open Secondary
          </Button>
        </DialogContent>
      </Dialog>
      
      <Dialog open={secondaryOpen} onOpenChange={setSecondaryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Secondary Dialog</DialogTitle>
          </DialogHeader>
          <p>This is a nested dialog.</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
``` 
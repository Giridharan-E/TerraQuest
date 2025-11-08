# TerraQuest Design System - Quick Reference Guide

## 🎨 Color Palette

### Primary Colors
```jsx
// Green (Primary Action)
bg-eco-500      // #3bb273 - Main green
bg-eco-600      // #2d9a5f - Darker green
text-eco-600    // Green text

// Amber (Points/Accent)
bg-amber-400    // #fbbf24 - Points badge
bg-amber-500    // #f59e0b - Hover state
```

### Gradients
```jsx
// Background gradients
bg-gradient-to-br from-eco-50 via-eco-100 to-eco-200
bg-gradient-to-br from-green-100 via-green-200 to-green-300

// Button gradients
bg-gradient-to-r from-eco-500 to-eco-600
bg-gradient-to-r from-amber-400 to-amber-500
```

## 📦 Component Quick Start

### 1. EcoButton
```jsx
import { EcoButton } from '@/components/terraquest';

// Primary action
<EcoButton variant="primary" icon="🌿">
  Scan Product
</EcoButton>

// Secondary action
<EcoButton variant="secondary">
  Redeem
</EcoButton>

// Outline style
<EcoButton variant="outline">
  Cancel
</EcoButton>
```

### 2. EcoCard
```jsx
import { EcoCard } from '@/components/terraquest';

<EcoCard 
  title="Section Title"
  subtitle="Optional subtitle"
  variant="gradient"
>
  Content goes here
</EcoCard>
```

### 3. EcoProgressBar
```jsx
import { EcoProgressBar } from '@/components/terraquest';

<EcoProgressBar 
  value={75} 
  max={100}
  label="Progress"
  showLabel
/>
```

### 4. BottomNavbar
```jsx
import { BottomNavbar } from '@/components/terraquest';

// Add to bottom of any page
<BottomNavbar />
```

### 5. EcoHeader
```jsx
import { EcoHeader } from '@/components/terraquest';

<EcoHeader 
  title="Page Title"
  subtitle="Page description"
  points={1240}
/>
```

### 6. EcoBadge
```jsx
import { EcoBadge } from '@/components/terraquest';

<EcoBadge variant="points">500 pts</EcoBadge>
<EcoBadge variant="level">Eco Guardian</EcoBadge>
```

## 🎯 Common Patterns

### Page Layout
```jsx
<div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-200 pb-20">
  <EcoHeader title="Page" subtitle="Description" />
  
  <div className="px-4 md:px-6 -mt-4">
    {/* Content */}
  </div>
  
  <BottomNavbar />
</div>
```

### Stat Cards
```jsx
<div className="grid grid-cols-3 gap-3">
  <div className="bg-white rounded-xl p-4 shadow-sm border border-eco-100">
    <div className="text-lg font-bold text-eco-500">1240</div>
    <div className="text-xs text-gray-600">EcoPoints</div>
  </div>
</div>
```

### Challenge/Reward Cards
```jsx
<div className="bg-white rounded-2xl p-4 shadow-eco border border-eco-100">
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-eco-100 flex items-center justify-center">
      <Icon />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold">Title</h3>
      <p className="text-sm text-gray-600">Description</p>
    </div>
    <EcoBadge variant="points">200 pts</EcoBadge>
  </div>
</div>
```

## 🎨 Utility Classes

### Shadows
- `shadow-eco` - Subtle shadow
- `shadow-eco-md` - Medium shadow
- `shadow-eco-lg` - Large shadow

### Spacing
- `px-4 md:px-6` - Page padding
- `gap-3` or `gap-4` - Element gaps
- `mb-6` - Section margins

### Borders
- `border border-eco-100` - Light green border
- `border-2 border-eco-500` - Strong green border
- `rounded-2xl` - Card corners

## 📱 Responsive Breakpoints

- **Mobile:** Base styles (375px+)
- **Tablet:** `md:` prefix (768px+)
- **Desktop:** `lg:` prefix (1024px+)

## ✅ Best Practices

1. **Use Design System Components** - Prefer EcoButton over custom buttons
2. **Consistent Spacing** - Use `px-4 md:px-6` for page padding
3. **Color Consistency** - Use `eco-*` colors instead of custom hex
4. **Shadow Consistency** - Use `shadow-eco` variants
5. **Responsive First** - Mobile styles first, then `md:` overrides

## 🔄 Migration Guide

### Replacing Custom Buttons
```jsx
// Before
<Button className="bg-green-500 text-white">Click</Button>

// After
<EcoButton variant="primary">Click</EcoButton>
```

### Replacing Custom Cards
```jsx
// Before
<div className="bg-white rounded-xl p-4 shadow">Content</div>

// After
<EcoCard variant="default">Content</EcoCard>
```

### Using BottomNavbar
```jsx
// Remove duplicate bottom nav code from pages
// Add single import:
import { BottomNavbar } from '@/components/terraquest';

// Add at bottom of page:
<BottomNavbar />
```


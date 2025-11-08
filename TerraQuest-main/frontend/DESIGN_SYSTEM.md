# TerraQuest Design System

A unified, eco-inspired design system for the TerraQuest sustainability app.

## 📦 Components Created

### Location: `frontend/src/components/terraquest/`

1. **EcoButton.jsx** - Reusable button with variants
2. **EcoCard.jsx** - Card component for content sections
3. **EcoProgressBar.jsx** - Animated progress bar
4. **BottomNavbar.jsx** - Shared bottom navigation
5. **EcoHeader.jsx** - Page header with gradient
6. **EcoBadge.jsx** - Badge component for achievements
7. **EcoIcon.jsx** - SVG icons and emoji constants
8. **index.js** - Component exports

## 🎨 Tailwind Theme Updates

### Custom Colors

```js
eco: {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',  // Primary green
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
}
```

### Custom Shadows

- `shadow-eco` - Subtle shadow (0 4px 12px rgba(0,0,0,0.05))
- `shadow-eco-md` - Medium shadow with green tint
- `shadow-eco-lg` - Large shadow with green tint

### Border Radius

- `rounded-xl` - 1rem
- `rounded-2xl` - 1.5rem

### Font Family

- Primary: Poppins, Inter, Manrope, sans-serif

## 🎯 Usage Examples

### Import Components

```jsx
import { 
  EcoButton, 
  EcoCard, 
  EcoProgressBar, 
  EcoHeader,
  BottomNavbar,
  EcoBadge,
  EcoIcon,
  EcoEmoji
} from '@/components/terraquest';
```

### Button Usage

```jsx
<EcoButton variant="primary" icon="🌿">
  Scan Product
</EcoButton>

<EcoButton variant="secondary">
  Redeem
</EcoButton>

<EcoButton variant="outline">
  Cancel
</EcoButton>
```

### Card Usage

```jsx
<EcoCard 
  title="My Progress"
  subtitle="Track your journey"
  variant="gradient"
  icon={<Leaf className="w-6 h-6" />}
>
  <p>Content here</p>
</EcoCard>
```

### Progress Bar Usage

```jsx
<EcoProgressBar 
  value={75} 
  max={100}
  label="Sustainability Score"
  showLabel
/>
```

### Badge Usage

```jsx
<EcoBadge variant="points">500 pts</EcoBadge>
<EcoBadge variant="level">Eco Guardian</EcoBadge>
<EcoBadge variant="locked" locked>Coming Soon</EcoBadge>
```

## 🌈 Color System

### Primary Colors
- **Green (Primary):** `#3bb273` / `eco-500`
- **Amber (Accent):** `#fbbf24` / `amber-400`

### Gradients
- **Background:** `from-eco-50 via-eco-100 to-eco-200`
- **Header:** `from-eco-100 via-eco-200 to-eco-300`
- **Buttons:** `from-eco-500 to-eco-600`

## 📐 Spacing System

- **Page Padding:** `px-4 md:px-6`
- **Card Padding:** `p-4 md:p-6`
- **Gap Between Elements:** `gap-3` or `gap-4`
- **Section Margin:** `mb-6`

## 🎭 Typography Scale

- **Page Title:** `text-2xl md:text-3xl font-semibold`
- **Section Title:** `text-lg font-semibold`
- **Card Title:** `text-md font-medium`
- **Body Text:** `text-sm text-gray-600`
- **Labels:** `text-xs text-gray-500`
- **Numbers:** `text-lg font-bold` or `text-2xl font-bold`

## 🎬 Animations

- **Fade In:** `animate-fade-in`
- **Pulse:** `animate-pulse-subtle`
- **Slide Up:** `animate-slide-up`

## 🧩 Component Variants

### EcoButton Variants
- `primary` - Green gradient
- `secondary` - Amber gradient
- `outline` - Outlined green
- `ghost` - Transparent

### EcoCard Variants
- `default` - White with border
- `highlight` - Highlighted border
- `gradient` - Green gradient background

### EcoBadge Variants
- `points` - Amber badge
- `level` - Green badge
- `success` - Green success
- `warning` - Amber warning
- `locked` - Gray locked

## 🔧 Integration

### 1. Import Theme CSS

Already added to `index.css`:
```css
@import './styles/terraquest-theme.css';
```

### 2. Use Components

Replace existing buttons/cards with TerraQuest components for consistency.

### 3. Apply Tailwind Classes

Use `eco-*` color classes and `shadow-eco` for consistent styling.

## 📱 Responsive Design

All components are mobile-first:
- Base styles for mobile (375px+)
- `md:` breakpoint for tablets (768px+)
- Consistent spacing and sizing

## 🎨 Design Tokens

### Shadows
- `shadow-eco` - 0 4px 12px rgba(0,0,0,0.05)
- `shadow-eco-md` - 0 8px 24px rgba(59,178,115,0.15)
- `shadow-eco-lg` - 0 12px 48px rgba(59,178,115,0.2)

### Border Radius
- Cards: `rounded-2xl` (1.5rem)
- Buttons: `rounded-2xl` (1.5rem)
- Badges: `rounded-full`

### Transitions
- Default: `transition-all duration-200`
- Hover: `hover:scale-105` or `hover:shadow-lg`

## 🚀 Next Steps

1. **Refactor Existing Pages** - Replace inline styles with design system components
2. **Create More Variants** - Add more component variants as needed
3. **Documentation** - Keep component docs updated
4. **Testing** - Ensure all components work across devices

## 📝 Notes

- All components use `cn()` utility for className merging
- Components are forwardRef compatible
- All components support standard HTML props
- Design system is fully compatible with existing Tailwind setup


# TerraQuest Design System

A unified, eco-inspired design system for TerraQuest sustainability app.

## Components

### EcoButton
Reusable button component with eco-themed variants.

```jsx
import { EcoButton } from '@/components/terraquest';

<EcoButton variant="primary" icon="🌿">
  Scan Product
</EcoButton>

<EcoButton variant="secondary">
  Redeem Points
</EcoButton>

<EcoButton variant="outline">
  Cancel
</EcoButton>
```

**Variants:**
- `primary` - Green gradient button (default)
- `secondary` - Amber/orange button
- `outline` - Outlined green button
- `ghost` - Transparent button

**Props:**
- `variant` - Button style variant
- `icon` - Optional emoji or icon before text
- `children` - Button text
- `className` - Additional CSS classes

---

### EcoCard
Card component for content sections.

```jsx
import { EcoCard } from '@/components/terraquest';

<EcoCard 
  title="My Progress" 
  subtitle="Track your sustainability journey"
  variant="gradient"
>
  <p>Card content here</p>
</EcoCard>
```

**Variants:**
- `default` - White card with green border
- `highlight` - Highlighted with stronger border
- `gradient` - Green gradient background

**Props:**
- `title` - Card title
- `subtitle` - Card subtitle
- `icon` - Optional icon component
- `variant` - Card style variant
- `children` - Card content

---

### EcoProgressBar
Animated progress bar with eco-themed colors.

```jsx
import { EcoProgressBar } from '@/components/terraquest';

<EcoProgressBar 
  value={75} 
  max={100}
  label="Sustainability Score"
  showLabel
/>
```

**Props:**
- `value` - Current progress value
- `max` - Maximum value (default: 100)
- `label` - Optional label text
- `showLabel` - Show percentage label

**Color Logic:**
- ≥70%: Green
- ≥50%: Amber
- <50%: Red

---

### BottomNavbar
Fixed bottom navigation bar (shared across all pages).

```jsx
import { BottomNavbar } from '@/components/terraquest';

<BottomNavbar />
```

Automatically handles:
- Active route highlighting
- Navigation routing
- Icon animations

---

### EcoHeader
Page header with gradient background and optional points badge.

```jsx
import { EcoHeader } from '@/components/terraquest';

<EcoHeader 
  title="Dashboard"
  subtitle="Welcome back!"
  points={1240}
/>
```

**Props:**
- `title` - Header title
- `subtitle` - Header subtitle
- `points` - Optional points to display in badge
- `icon` - Optional icon component

---

### EcoBadge
Badge component for achievements, levels, and status.

```jsx
import { EcoBadge } from '@/components/terraquest';

<EcoBadge variant="points">500 pts</EcoBadge>
<EcoBadge variant="level">Eco Guardian</EcoBadge>
<EcoBadge variant="locked" locked>Coming Soon</EcoBadge>
```

**Variants:**
- `points` - Amber badge for points
- `level` - Green badge for levels
- `success` - Green success badge
- `warning` - Amber warning badge
- `locked` - Gray locked badge

**Props:**
- `variant` - Badge style
- `locked` - Show lock icon
- `icon` - Optional emoji icon

---

### EcoIcon
SVG icon component for eco-themed actions.

```jsx
import { EcoIcon, EcoEmoji } from '@/components/terraquest';

<EcoIcon name="leaf" className="w-6 h-6 text-green-600" />
<span>{EcoEmoji.Leaf}</span>
```

**Available Icons:**
- `leaf` - Leaf icon
- `recycle` - Recycle icon
- `sun` - Sun icon
- `water` - Water droplet icon
- `earth` - Globe icon
- `tree` - Tree icon

**EcoEmoji:**
- `EcoEmoji.Leaf` - 🌿
- `EcoEmoji.Recycle` - ♻️
- `EcoEmoji.Sun` - 🌞
- `EcoEmoji.Water` - 💧
- `EcoEmoji.Earth` - 🌎
- `EcoEmoji.Tree` - 🌳
- `EcoEmoji.Trophy` - 🏆
- `EcoEmoji.Gift` - 🎁
- `EcoEmoji.Award` - 🏅

---

## Tailwind Theme

### Colors

```jsx
// Eco colors
bg-eco-50   // Lightest green
bg-eco-100
bg-eco-200
bg-eco-300
bg-eco-400
bg-eco-500   // Primary green (#22c55e)
bg-eco-600   // Dark green

// Amber colors
bg-amber-400 // Points/accent color
bg-amber-500
bg-amber-600
```

### Shadows

```jsx
shadow-eco      // Subtle shadow
shadow-eco-md   // Medium shadow
shadow-eco-lg   // Large shadow
```

### Border Radius

```jsx
rounded-xl   // 1rem
rounded-2xl  // 1.5rem
```

---

## Usage Example

```jsx
import { 
  EcoButton, 
  EcoCard, 
  EcoProgressBar, 
  EcoHeader,
  BottomNavbar 
} from '@/components/terraquest';

function MyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-200 pb-20">
      <EcoHeader 
        title="My Page"
        subtitle="Eco-friendly content"
        points={1240}
      />
      
      <div className="px-4 md:px-6 -mt-4">
        <EcoCard title="Progress" variant="gradient">
          <EcoProgressBar value={75} max={100} showLabel />
        </EcoCard>
        
        <EcoButton variant="primary" icon="🌿">
          Take Action
        </EcoButton>
      </div>
      
      <BottomNavbar />
    </div>
  );
}
```

---

## Design Principles

1. **Consistency** - All components share the same design language
2. **Eco-Inspired** - Nature-themed colors and gradients
3. **Gamified** - Badges, progress bars, and achievements
4. **Accessible** - Proper contrast and focus states
5. **Responsive** - Mobile-first design approach

---

## Color Palette

- **Primary Green:** `#3bb273` (eco-500)
- **Accent Amber:** `#fbbf24` (amber-400)
- **Gradients:** `from-eco-50 via-eco-100 to-eco-200`
- **Neutral:** Gray scale for text and backgrounds

---

## Spacing

- **Padding:** `px-4 md:px-6` (consistent horizontal padding)
- **Gap:** `gap-3` or `gap-4` (consistent spacing between elements)
- **Margin:** `mb-6` (consistent vertical spacing)

---

## Typography

- **Headers:** `text-xl font-semibold` or `text-2xl font-semibold`
- **Body:** `text-sm text-gray-600`
- **Labels:** `text-xs text-gray-500`
- **Bold Numbers:** `text-lg font-bold` or `text-2xl font-bold`


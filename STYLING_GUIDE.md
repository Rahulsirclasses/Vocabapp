# 🎨 How to Change Colors and Styling in WordWiz

## 📍 Main Styling Files

### 1. **Global CSS Variables** - `styles/globals.css`
This is the MAIN file for changing colors across the entire app.

#### How to Change Colors:

**Lines 6-40: Light Mode Colors**
```css
:root {
  --foreground: oklch(0.145 0 0);  /* Main text color */
  --background: oklch(1 0 0);       /* Background color */
  --primary: oklch(0.205 0 0);      /* Primary buttons */
  --accent: oklch(0.97 0 0);        /* Accent elements */
  /* ... more colors */
}
```

**Lines 42-75: Dark Mode Colors**
```css
.dark {
  --foreground: oklch(0.985 0 0);  /* Main text color (dark mode) */
  --background: oklch(0.145 0 0);   /* Background color (dark mode) */
  /* ... more colors */
}
```

---

## 🎯 Quick Color Changes

### Change Main Text Color

**File:** `styles/globals.css`

**Light Mode (Line 8):**
```css
--foreground: oklch(0.145 0 0);  /* Dark text */
```

**Dark Mode (Line 44):**
```css
--foreground: oklch(0.985 0 0);  /* Light text */
```

**To change:** Modify the first number (0-1 scale)
- `0` = Black
- `0.5` = Gray
- `1` = White

---

### Change Background Color

**File:** `styles/globals.css`

**Light Mode (Line 7):**
```css
--background: oklch(1 0 0);  /* White background */
```

**Dark Mode (Line 43):**
```css
--background: oklch(0.145 0 0);  /* Dark background */
```

---

### Change Button Colors

**File:** `styles/globals.css`

**Primary Button (Line 13):**
```css
--primary: oklch(0.205 0 0);  /* Button background */
--primary-foreground: oklch(0.985 0 0);  /* Button text */
```

---

## 🎨 Page-Specific Styling

### Login Page Colors

**File:** `app/auth/login/page.tsx`

Look for these classes:
- `text-white` - White text
- `text-slate-400` - Gray text
- `text-violet-400` - Purple links
- `bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950` - Background gradient

**Example Change:**
```tsx
// Line 140-ish: Change link color
<Link href="/auth/signup" className="text-violet-400">
  Sign up
</Link>

// Change to blue:
<Link href="/auth/signup" className="text-blue-400">
  Sign up
</Link>
```

---

### Home Page Colors

**File:** `app/page.tsx`

Find and change:
- Background gradients
- Text colors
- Button colors

---

## 🌈 Available Tailwind Colors

You can use these in any component:

### Text Colors:
- `text-white` - White
- `text-black` - Black
- `text-slate-400` - Light gray
- `text-slate-600` - Medium gray
- `text-violet-400` - Purple
- `text-blue-400` - Blue
- `text-green-400` - Green
- `text-red-400` - Red
- `text-amber-400` - Orange/Amber

### Background Colors:
- `bg-white` - White
- `bg-slate-900` - Dark gray
- `bg-violet-600` - Purple
- `bg-blue-600` - Blue
- `bg-gradient-to-br from-slate-950 to-slate-900` - Gradient

---

## 📝 Common Changes

### 1. Change "Sign in with Google" Button Color

**File:** `app/auth/login/page.tsx` (Line ~150)

```tsx
<Button
  className="w-full border-white/20 text-white hover:bg-white/10"
>
  Sign in with Google
</Button>
```

**Change to blue:**
```tsx
<Button
  className="w-full border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
>
  Sign in with Google
</Button>
```

---

### 2. Change Link Colors

**Find:** `text-violet-400`
**Replace with:** `text-blue-400` (or any color)

**Example locations:**
- Login page: Line ~180
- Signup page: Line ~179

---

### 3. Change Button Gradients

**Find:**
```tsx
className="bg-gradient-to-r from-violet-600 to-indigo-600"
```

**Change to:**
```tsx
className="bg-gradient-to-r from-blue-600 to-cyan-600"
```

---

## 🔧 How to Apply Changes

### Method 1: Edit Component Files Directly

1. Open the page file (e.g., `app/auth/login/page.tsx`)
2. Find the className you want to change
3. Replace the color class
4. Save the file
5. ✅ Changes appear immediately (hot reload)

### Method 2: Edit Global CSS

1. Open `styles/globals.css`
2. Find the CSS variable (e.g., `--foreground`)
3. Change the value
4. Save the file
5. ✅ Changes apply across entire app

---

## 📂 Key Files for Styling

| File | What It Controls |
|------|------------------|
| `styles/globals.css` | Global colors, CSS variables, theme |
| `app/auth/login/page.tsx` | Login page styling |
| `app/auth/signup/page.tsx` | Signup page styling |
| `app/page.tsx` | Home page styling |
| `app/learn/page.tsx` | Learning dashboard styling |
| `components/ui/button.tsx` | Button component styles |

---

## 💡 Pro Tips

### 1. Use Browser DevTools
- Right-click on element → Inspect
- See the exact classes being used
- Test color changes live

### 2. Tailwind Color Shades
- `400` - Lighter
- `500` - Medium
- `600` - Darker
- `700` - Very dark

### 3. Opacity
- `/10` - 10% opacity
- `/20` - 20% opacity
- `/50` - 50% opacity

**Example:**
```tsx
className="bg-white/10"  /* White with 10% opacity */
className="border-violet-500/20"  /* Violet border with 20% opacity */
```

---

## 🎯 Quick Examples

### Change All Purple to Blue

**Find and replace in all files:**
- `violet-400` → `blue-400`
- `violet-500` → `blue-500`
- `violet-600` → `blue-600`
- `indigo-600` → `cyan-600`

### Make Text Brighter

**In `styles/globals.css` (Line 44):**
```css
/* Change from: */
--foreground: oklch(0.985 0 0);

/* To: */
--foreground: oklch(1 0 0);  /* Pure white */
```

### Change Background to Pure Black

**In `styles/globals.css` (Line 43):**
```css
/* Change from: */
--background: oklch(0.145 0 0);

/* To: */
--background: oklch(0 0 0);  /* Pure black */
```

---

## ✅ Summary

**For global changes:** Edit `styles/globals.css`
**For page-specific changes:** Edit the page component file
**For component changes:** Edit the component file in `components/`

**All changes are live-reloaded** - just save and see the changes immediately!

---

**Need help with a specific color change? Let me know which element you want to change and I'll show you exactly where to edit it!**

# Modern Minimal Premium UI/UX Redesign Plan

## 🎨 Design Vision
The goal is to transform the CryptoMNG dashboard into a state-of-the-art, premium experience that feels both professional and cutting-edge. We will transition from a "standard dashboard" look to a "high-end trading terminal" aesthetic.

### Key Pillars
1. **Glassmorphism & Depth**: Subtle use of backdrop blurs and multi-layered transparent cards.
2. **Modern Typography**: High contrast between bold titles and clean, airy body text.
3. **Micro-Interactions**: Smooth transitions and hover states that provide tactile feedback.
4. **Curated Color Palette**: Deep charcoals, electric accents (cyan, emerald, violet), and subtle gradients.
5. **Generous Spacing**: Creating "air" to reduce cognitive load and emphasize focus.

---

## 🛠 Implementation Steps

### 1. Global Styles Refresh (`globals.css`)
- [ ] **Surface Variables**: Update `--background` to a deeper black-slate.
- [ ] **Glass Utility**: Refine the `backdrop-blur` classes for consistent "frosted" looks.
- [ ] **Selection State**: Customize text selection colors for a premium feel.
- [ ] **Gradients**: Add predefined "mesh gradient" utilities for card backgrounds.

### 2. Layout & Typography (`layout.tsx`)
- [ ] **Interactive Background**: Enhance the existing dot pattern with a moving radial glow.
- [ ] **Typography Hierarchy**: Standardize header sizes and weights.
- [ ] **Breadcrumbs & Navigation**: Make current-page indicators more subtle yet distinct.

### 3. Core Component Redesign
- [ ] **SignalCard**:
    *   0.5px subtle border.
    *   Transition-all logic (scale + shadow uplift).
    *   Clearer Token identification.
- [ ] **StatsCards**:
    *   "Ambient light" effect on hover.
    *   Subtle data visualizations (small sparklines if possible).
- [ ] **Modals**: Full-page blurred backdrops with centered, high-focus content.

### 4. Page Redesigns
- [ ] **Dashboard**: Re-organize stats into a "Command Center" layout.
- [ ] **Signals Page**: High-performance grid with sleek filtering.
- [ ] **Admin Pages**: Professional, data-heavy but clean management interfaces.

---

## 🚀 Next Steps
1. **Update Global CSS**: Establish the foundation.
2. **Refine Sidebar/Navbar Integrations**: Ensure they blend with the new page styles.
3. **Iterative Page Updates**: Start with the Dashboard as the flagship redesign.

---
name: Ping Pang & Co. Elite
colors:
  surface: '#F9F9FF'
  surface-dim: '#D3DAEA'
  surface-bright: '#F9F9FF'
  surface-container-lowest: '#FFFFFF'
  surface-container-low: '#F0F3FF'
  surface-container: '#E7EEFE'
  surface-container-high: '#E2E8F8'
  surface-container-highest: '#DCE2F3'
  on-surface: '#151C27'
  on-surface-variant: '#424846'
  inverse-surface: '#2A313D'
  inverse-on-surface: '#EBF1FF'
  outline: '#727976'
  outline-variant: '#C1C8C4'
  surface-tint: '#4A645C'
  primary: '#000A07'
  on-primary: '#FFFFFF'
  primary-container: '#0A241E'
  on-primary-container: '#728D84'
  inverse-primary: '#B1CDC3'
  secondary: '#5D5F5F'
  on-secondary: '#FFFFFF'
  secondary-container: '#DFE0E0'
  on-secondary-container: '#616363'
  tertiary: '#050808'
  on-tertiary: '#FFFFFF'
  tertiary-container: '#1D2020'
  on-tertiary-container: '#858887'
  error: '#BA1A1A'
  on-error: '#FFFFFF'
  error-container: '#FFDAD6'
  on-error-container: '#93000A'
  primary-fixed: '#CCE9DF'
  primary-fixed-dim: '#B1CDC3'
  on-primary-fixed: '#06201A'
  on-primary-fixed-variant: '#334C45'
  secondary-fixed: '#E2E2E2'
  secondary-fixed-dim: '#C6C6C7'
  on-secondary-fixed: '#1A1C1C'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#E1E3E2'
  tertiary-fixed-dim: '#C4C7C6'
  on-tertiary-fixed: '#191C1C'
  on-tertiary-fixed-variant: '#444747'
  background: '#F9F9FF'
  on-background: '#151C27'
  surface-variant: '#DCE2F3'
typography:
  headline-xl:
    fontFamily: Lexend
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The brand personality of this design system is authoritative, rhythmic, and high-performance. It is built for the dedicated table tennis athlete—from basement enthusiasts to professional circuit players—who view the sport through a lens of precision and data. The UI must evoke the "flow state" of a high-speed rally: fast, responsive, and focused.

The design style is **Minimalist-Athletic**. It leverages expansive white space and a restricted, high-contrast palette to ensure performance data remains the focal point. Key characteristics include:
- **Kinetic Typography:** Using massive, tightly-tracked headings to convey power.
- **Data Density:** A structured, grid-based approach to statistics, mimicking the analytical depth of professional chess or cycling apps.
- **Premium Restraint:** Avoiding unnecessary flourishes to focus on functional clarity and high-quality "equipment-like" UI elements.

## Colors

The color palette is anchored by **Deep Forest Green**, a sophisticated alternative to traditional black that provides a premium, "clubhouse" feel.

- **Primary (#0A241E):** Used for heavy headings, primary buttons, and dark-mode section backgrounds. It represents the "rubber" and "table" essence of the sport.
- **Surface & Backgrounds:** We utilize a "Crisp White" for main content areas to maintain high readability. A "Subtle Light Grey" (#F2F4F3) is used to differentiate between card layers and background canvases.
- **Semantic Accents:** While not in the primary variables, a "Performance Green" (brighter) should be used for positive trends/ELO gains, and a muted "Warning Red" for losses or critical fatigue alerts.

## Typography

This design system uses a dual-font strategy to balance athletic aggression with functional data reading.

- **Headlines (Lexend):** Chosen for its geometric clarity and athletic weight. Heavy weights (700-800) should be used for large displays, often in all-caps or with tight letter-spacing to create a "blocky," impactful visual signature.
- **Body & Data (Manrope):** A refined, modern sans-serif that excels in numerical displays and technical stats. It provides the "professional" counterbalance to the loud headlines.
- **Visual Treatment:** Headlines in the Forest Green color should occasionally overlap section boundaries to create a sense of depth and movement.

## Layout & Spacing

This design system utilizes a **Fixed Grid** for desktop (12 columns) and a **Fluid Grid** for mobile (4 columns).

- **The Rhythm:** We follow a 4px baseline grid. Spacing between cards and primary sections is generous (32px+) to prevent the data from feeling cluttered.
- **Information Architecture:** Content is organized into "Clusters." A cluster consists of a label (uppercase, small), a large headline/metric, and a supporting visualization (graph or list).
- **Horizontal Flow:** In stats-heavy views, use a horizontal scroll for "Quick Stats" chips to keep the vertical height of the primary cards manageable.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Low-Contrast Outlines** rather than heavy shadows.

- **Layer 0 (Canvas):** Subtle Light Grey (#F2F4F3).
- **Layer 1 (Cards):** Crisp White (#FFFFFF). These cards should have a very fine, 1px border in a slightly darker grey (#E5E7EB) to define edges without adding visual weight.
- **Layer 2 (Interactions):** Active states or hovered cards use a soft, ambient shadow (0px 4px 20px rgba(10, 36, 30, 0.05)) to suggest "lift."
- **Inversion:** Significant call-to-action sections (like "Start Match") should use the Forest Green as a background to create a "recessed" or "anchor" effect within the light layout.

## Shapes

The shape language reflects the precision of the sport.

- **Cards & Containers:** We use a standard 0.5rem (8px) radius. This provides a modern, friendly feel while remaining structured enough for dense data.
- **Interactive Elements:** Buttons utilize the `rounded-lg` (1rem) or pill-shapes to distinguish them clearly from information-only cards.
- **Iconography:** Icons should be "Linear" with a 2px stroke weight, mirroring the clean lines of a table tennis court. Avoid filled icons unless indicating an active state in the navigation bar.

## Components

- **Metric Cards:** The hero of this design system. A white background, a small uppercase label at the top-left, a large bold Forest Green value in the center, and a small sparkline or percentage change at the bottom.
- **Action Buttons:**
    - *Primary:* Solid Forest Green with White Lexend text (Bold).
    - *Secondary:* Ghost style with 1.5px Forest Green border.
- **Status Chips:** Small, pill-shaped indicators for "Match Type" (e.g., Ranked, Casual). Use a light tint of the primary color with dark text.
- **Lists:** Clean, border-bottom only separation. Use the "Arrow-Right" icon on the far right to indicate drill-down capability for match history.
- **The "Rally" Input:** Search and input fields should have a light grey fill (#F9FAFB) and no border, becoming Forest Green only when focused.
- **Athlete Avatars:** Circular with a 2px Forest Green border for "Verified" or "Pro" players.
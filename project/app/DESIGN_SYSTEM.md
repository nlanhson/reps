# Reps — Design System Reference

This is the **usage guideline**, not a build log — for the chronological history of how
each piece got built, see `../STATE.md`. Read this before building any new screen so new
UI aligns with what already exists instead of reinventing it.

## Two rules

**1. Native-first.** Whenever an Apple native iOS component/system can do the job, use it
instead of a custom equivalent — the app should feel natively iOS and pick up Liquid Glass /
system behavior for free on iOS 26. Concretely today: pushed screens use the **native stack
header** (native back button), not a custom back chevron; the tab bar is the native system
bar on modern tiers; `Toggle` wraps the native `Switch`. When adding a screen or control,
check for a native option before hand-rolling one. (See §6.)

**2. Screens never hardcode a hex, a pixel size, or a color literal.** Everything comes from
`src/theme` (semantic tokens) or `src/components` (shared components built on those
tokens). If a screen needs something the token/component set doesn't have yet, add it to
the system first — don't inline a one-off value.

```js
import { colors, typography, spacing, radius, useTypography } from '../theme';
import { Card, AppButton, ListRow } from '../components';
```

---

## 1. Tokens

Two layers — `src/theme/primitives.js` (raw, never import from screens) →
`src/theme/theme.js` (semantic, import this). Full definitions live in those files; this
is the lookup table.

### Color

| Token | Value | Use for |
|---|---|---|
| `colors.bg` | `#050505` | screen background |
| `colors.surface` | `#101010` | cards, list items |
| `colors.surfaceElevated` | `#2E2D32` | raised elements, inputs, secondary buttons |
| `colors.surfaceSunken` | `#0B0B0B` | flat tiles, darker than cards |
| `colors.surfaceChip` | `#1F1F21` | small pill/badge backgrounds |
| `colors.textPrimary` | `#EBEBEB` | primary text |
| `colors.textSecondary` | `#949494` | secondary text/labels |
| `colors.textMuted` | `#B1B1B1` | muted text |
| `colors.textFaint` | `#727272` | dimmest — neutral deltas |
| `colors.accent` | `#F05305` | brand orange — primary actions only |
| `colors.hairline` | `rgba(255,255,255,0.08)` | card border (shadcn-style crisp edge) |
| `colors.success` / `colors.danger` | `#34C759` / `#FF383C` | feedback only, never decorative |

Never reach for a raw hex. If a new color role is genuinely needed, add it to
`theme.js`'s `colors` object with a comment explaining the role — don't inline it.

### Typography

Apple HIG text styles, via `useTypography()` (**not** the static `typography` import —
the hook scales `lineHeight` by the OS Dynamic Type `fontScale`; any `<Text>` should use
it). `body` is 17pt, the HIG default.

`largeTitle` `title1` `title2` `title3` `headline` `body` `bodyStrong` `callout`
`subhead` `footnote` `caption1` `caption2`

Legacy aliases (`h1`–`h6`, `caption`, `captionSmall`, `label`) still work and map to the
nearest HIG style — fine in existing code, prefer the HIG names in anything new.

```js
const typography = useTypography();
<Text style={[typography.body, { color: colors.textPrimary }]}>…</Text>
```

### Spacing (4pt base) — **inferred, not measured**

`spacing.xs`(4) `sm`(8) `md`(12) `lg`(16) `xl`(20) `2xl`(24) `3xl`(32) `4xl`(40) `5xl`(48)

Flagged because it wasn't pixel-measured against the screenshots — if a new screen's
spacing looks visibly off vs. the source screenshot, that's the scale to re-check first.

### Radius

`radius.sm`(10) small elements · `radius.md`(18) buttons & small controls · `radius.lg`(24)
big cards · `radius.pill`(999) chips/pills. Always spread `borderCurve` (`'continuous'`)
alongside `borderRadius` for the iOS squircle look: `{ borderRadius: radius.lg, borderCurve }`.

### Gradients & shadows

`gradients.surface` / `gradients.surfaceElevated` — vertical top→bottom fills, fallback
tier only (glass/material tiers ignore gradient and use their own chrome). `shadows.sm` /
`shadows.md` — soft shadcn-style elevation; apply to an **outer** wrapper, never a view
with `overflow:hidden`, or iOS clips the shadow.

---

## 2. Runtime UI tiers

The app renders one of three chrome styles per launch — `useUITier()` → `liquid-glass |
material-you | fallback`. **Screens don't branch on tier.** Only shared components do,
centrally, via `src/theme/tiers.ts` + `TierSurface`. If you're building a new component
that needs a background/surface, use `<TierSurface role="...">` (see `Card.js`,
`ConfirmDialog.js` for examples) rather than hardcoding a fallback-only look — that's
exactly the gap that made `AppButton`/`Chip` non-solid variants and `ScreenHeader`
glass-blind until this pass.

`SurfaceRole`: `'surface'` (cards) · `'control-filled'` (secondary buttons) ·
`'control-outline'` (outline buttons, unselected chips) · `'bar'` (tab bar, floating
headers) · `'sheet'` (modals/dialogs).

Rule of thumb: **brand-colored elements (primary/destructive buttons, selected chips,
the accent itself) stay solid on every tier** — only the neutral/secondary chrome adapts.

---

## 3. Component catalog

All in `src/components/`, imported from the barrel (`../components`). One line each on
when to reach for it.

| Component | Use for |
|---|---|
| `Card` | Generic surface container — base for anything with a background |
| `AppButton` | Every button. Variants: `primary` `secondary` `outline` `ghost` `destructive`. Sizes: `md` `sm` |
| `Chip` | Filter/tag pill, single or multi-select |
| `Toggle` | On/off switch (settings rows) — wraps RN `Switch`, themed |
| `ListRow` | Settings-style row: icon + label + value/chevron/custom trailing (e.g. a `Toggle`) |
| `ExerciseRow` | Exercise line with avatar + name + meta, used in workout/plan detail |
| `RoutineRow` | Gradient card row for a routine/workout list (Home) |
| `SessionCard` | Collapsible logged-session summary (History) |
| `StatTile` | Big number + caption label on a card (streaks, totals) — reusable for any stat, not Profile-specific |
| `Avatar` | Circular profile avatar — photo `uri` or initials fallback |
| `CalendarMonth` | Month heatmap grid — per-day intensity 0–1 (Calendar screen) |
| `FolderCard` | iOS-folder-silhouette card for the Library grid |
| `ScreenHeader` | `variant="large"` big-title header for tab roots (Home/History/Profile). **`variant="back"` is deprecated for real screens** — pushed screens use the native stack header instead (see §7); back-variant survives only in the Gallery + for cases the native header genuinely can't cover |
| `UnderlineTabs` | Two-way switcher with an underline indicator (Workouts / Library) |
| `SectionLabel` | Small caption header above a section |
| `Separator` | Hairline divider between list rows, optional `inset` to clear a leading icon |
| `ConfirmDialog` | Centered confirm/cancel modal |
| `Icon` | **The only way to render an icon.** Maps a name to an SF Symbol (iOS) with an `@expo/vector-icons` fallback. Never import `@expo/vector-icons` directly — add the name to `Icon.js`'s map instead |
| `ProgressChart` | Single-series line+area chart (Workout Detail progress) |

### Known duplication (not yet worth refactoring)
`ExerciseRow` has a local tinted-circle-with-barbell-icon "Avatar" helper (exercise
thumbnail placeholder) that is unrelated to the shared `Avatar` component (profile
identity) added in this pass — same visual idea, different purpose. Leave as-is until
real exercise thumbnail images land; don't merge them speculatively.

---

## 4. Do / don't

- **Do** reuse a component before restyling one. If two screens need visually-similar-but-
  not-identical rows, prefer adding a prop over forking the component.
- **Do** use `useTypography()`, not the static `typography` export, in anything that
  renders `<Text>`.
- **Do** route new icons through `Icon.js`'s name map, never inline `@expo/vector-icons`.
- **Do** check `borderCurve` is spread next to every new `borderRadius`.
- **Don't** hardcode a hex/px value in a screen — add the token first.
- **Don't** branch a screen component on `useTier()` directly — build/extend a shared
  component that already does it (`TierSurface`, or follow the `AppButton`/`Chip` pattern
  of a `glass` boolean derived from `useTier()`).
- **Don't** assume the spacing scale is correct — it's inferred, flag visible drift.

---

## 5. Verification checklist for new UI

No test runner/linter exists. Before calling a new component or screen done:

1. `npx tsc --noEmit` — theme layer + hooks are TypeScript
2. `npx expo export --platform ios --output-dir /tmp/check` — catches import/syntax errors
3. Add it to the hidden `Gallery` route (`src/screens/StyleGalleryScreen.js`) so it's
   checkable in isolation before wiring into a real screen
4. Simulator/device screenshot for actual visual confirmation — steps 1–3 catch
   crashes and typos, not "does this look right"

## 6. Native-first: headers & what's still custom

**Pushed screens use the native stack header.** Leave the header shown in `RootNavigator`
(don't set `headerShown: false`), set `headerBackButtonDisplayMode: 'minimal'` for the clean
chevron, and set the title + trailing actions per-screen with `navigation.setOptions` in a
`useLayoutEffect` (`headerRight` for share/kebab). `PlanDetailScreen` and `WorkoutDetailScreen`
are the reference implementations; `SettingsScreen`/`CalendarScreen` also use the native header.
The screen body then drops the top safe-area edge (the header owns it).

Already native: tab bar (native system bar on liquid-glass/material-you tiers), pushed-screen
back buttons, `Toggle` (native `Switch`).

Candidates still custom (convert when touched, not speculatively):
- **Tab-root large titles** (Home/History/Profile) still use `ScreenHeader variant="large"`
  rather than a native large-title header — bigger change (per-tab native headers), deferred.
- **`ConfirmDialog`** is a custom `Modal`, not a native `Alert`/action sheet.
- **Kebab/context menus** aren't built yet — use a native menu (`Menu`/context menu) when they are.

## 7. Open verification debt (not blocking, but unresolved)

These were true before this pass and still are — call them out if they become relevant:
- Android Inter font render never confirmed on an emulator
- Dynamic Type reflow (Larger Text) never confirmed on-device
- Liquid Glass tier confirmed on simulator only, not the physical iPhone
- The new glass-on-controls code path (`AppButton`/`Chip` non-solid variants) is
  untested on-device — it's a reasonable extension of the existing `TierSurface`/
  `GlassSurface` pattern but hasn't been screenshotted on iOS 26

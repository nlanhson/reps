# Reps — Project State

## What
Reps — a workout logger / tracker mobile app.

## Stack
- **React Native + JavaScript** (NOT SwiftUI — ported from an original SwiftUI concept)
- **Expo SDK 54** (RN 0.81.5, React 19.1.0). NOTE: pinned to 54 (not latest 56) because
  App Store Expo Go on the user's iPhone 17 only supports SDK 54 — SDK 56 won't open in
  Expo Go on a physical device until Apple approves the matching Expo Go build.
  Do NOT `expo install --fix` to a newer SDK without re-checking phone Expo Go support.
- Targeting iOS (and RN cross-platform by default)

## Brand
- Primary / accent: orange `#F05305`

## Source material
- Design comes from **screenshots** of the existing app, dropped in `project/brief/screenshots/`
- No written PRD/WBS yet — screenshots are the source of truth for the UI

## Stage
- [x] Repo cloned, skills bundled (unicorn-skills toolkit)
- [x] Screenshots provided (3 PNGs: design system, component sheet, 9 app screens)
- [x] Screens inventoried (9: Home, Plan Detail, Workout Detail, History, Profile, Settings, Home-in-session, In-session, Calendar/Heatmap)
- [x] Design system extracted → `project/app/src/theme/` (primitives.js, theme.js, index.js)
- [x] RN project scaffolded — **Expo SDK 56** (RN 0.85, React 19), blank JS template at `project/app/`
- [x] Tokens wired into `App.js` + bundle verified (`expo export`, 571 modules, no errors)
- [x] Navigation + tab shell — React Navigation (native-stack + bottom-tabs), dark themed
      - Tabs: Home / History / Profile (Ionicons). Pushed: PlanDetail, WorkoutDetail, InSession (modal), Settings, Calendar
      - All 8 screens stubbed via `ScreenPlaceholder`; bundle verified
- [x] Home screen built + REFINED to match the real Home screenshot — `src/screens/HomeScreen.js`:
      gradient hero (main-routine recommendation), bordered gradient "Start Empty Workout",
      `<routine name> | Library` underline tabs, and a vertical routine list (RoutineRow with
      play affordance) replacing the old folder grid. Mock now has `mainRoutine.workouts`.
      Verified on the iOS simulator with a screenshot — matches the provided design.
- [x] In-session screen built — live duration timer, computed volume/sets, collapsible exercise cards, editable set table (kg/reps), done checkboxes, working rest-timer bar (−15/+15/Skip). `src/screens/InSessionScreen.js`, mock `src/data/session.js`. Bundle verified.
- [x] Shared component library extracted from the component sheet — `src/components/`:
      Card, Chip, ScreenHeader (large + back variants), SectionLabel, ListRow, ExerciseRow,
      StatTile, WeekStrip, UnderlineTabs, SessionCard, ConfirmDialog (+ existing AppButton).
      Barrel at `src/components/index.js`. Semantic tokens only (no hardcoded hex/sizes).
      Color + type tokens verified 1:1 vs the design-system sheet; spacing/radius kept (match shots).
- [x] Style Gallery kitchen-sink screen (`src/screens/StyleGalleryScreen.js`, hidden `Gallery`
      route) renders every component once — the artifact for verifying visual style before
      building real screens. Bundle verified (`expo export`, no errors).
- [x] Surface GRADIENTS added — `expo-linear-gradient` (~15.0.8, SDK-54-safe). Raw values in
      `theme/primitives.js` (`gradient.elevated` #252429→#1D1C21 lighter; `gradient.surface`
      #18171B→#121215 darker), semantic `gradients.surfaceElevated/.surface` in `theme/theme.js`.
      `Card` takes a `gradient` prop; `RoutineRow` is gradient-backed. NOTE: adding this native
      module required a native rebuild (`expo run:ios`) — the old dev build threw "Unimplemented
      component: ExpoLinearGradient" until recompiled.
- [x] shadcn-STYLE polish pass (NOTE: real shadcn/ui is web-only — Radix + Tailwind + DOM —
      so it cannot run in RN. We applied its *visual language* to the existing token components
      instead; no new deps). Added `colors.hairline` (rgba(255,255,255,0.08)) + `colors.ring`,
      and a `shadows` scale (sm/md) in `theme/theme.js`. `Card` now renders a hairline border +
      soft shadow by default (shadow on an outer wrapper because overflow:hidden clips iOS
      shadows). `AppButton` gained variants (primary/secondary/outline/ghost/destructive) + sizes +
      disabled. `Chip` inactive = outline badge. New `Separator` for list dividers (used in
      SessionCard + Gallery). Kept the orange brand + gradients. Verified on simulator (Home + Gallery).
- [x] Home Workouts/Library switcher built to its component spec. `UnderlineTabs` =
      `<preferred routine> | Library` with per-tab actions in the tab row: Workouts → pin
      (MaterialCommunityIcons `pin-outline`); Library → sort (`sort-variant`) + add-folder
      (`plus-box-outline`). Workouts tab = preferred routine's workouts (RoutineRow list);
      Library tab = 2-col grid of `FolderCard` (one per saved routine) → PlanDetail. New
      `FolderCard` = manila-folder silhouette (tab + gradient body, no SVG), options icon +
      name + "N items". Verified on simulator (both tab states). NOTE: first tab label kept as
      the routine name (matches the real phone screenshot); component sheet showed generic
      "Workouts" — flag if you want the generic label instead.
- [x] Home tab-switch ANIMATION (Library ⇄ Workouts). Built with RN `Animated` (native driver,
      no new deps): incoming content fades + slides in `SLIDE=24px` from the side its tab sits on
      (spatial consistency), `DURATION=200ms`, strong ease-out `Easing.bezier(0.23,1,0.32,1)`.
      Only opacity + translateX (GPU). Respects OS reduce-motion via `AccessibilityInfo` — drops
      the slide, keeps a quick fade. Per emil-design-eng (tab switches are frequent → kept subtle/
      fast) + motion-sensitivity (reduce-motion non-negotiable). Verified mid-transition on sim.
- [x] iOS ICON SET = SF Symbols. `expo-symbols` (~1.0.8) renders real Apple SF Symbols on iOS.
      Central `src/components/Icon.js` wrapper maps the app's icon names → SF Symbol names and
      renders `SymbolView` on iOS; on Android (or if a symbol is unavailable on the device) it
      falls back to the matching `@expo/vector-icons` glyph (set per-name in the map). ALL icon
      usages migrated (10 files: screens + shared components + GlassTabBar) from `<Ionicons>`/
      `<MaterialCommunityIcons>` to `<Icon>`; only Icon.js imports vector-icons now (the fallback).
      NATIVE REBUILD required (expo-symbols is native) — done via `expo run:ios`. Verified on sim.
- [x] Bottom tab bar switched to the NATIVE system tab bar — `react-native-bottom-tabs` +
      `@bottom-tabs/react-navigation` (v1.2.0). `RootNavigator` uses `createNativeBottomTabNavigator`:
      a real UITabBarController (iOS → Liquid Glass on iOS 26, automatic) / BottomNavigationView
      (Android). Icons = SF Symbols via `tabBarIcon: () => ({ sfSymbol })` (house.fill / list.bullet /
      person.fill), active tint = accent. Config plugin auto-added to app.json; NATIVE REBUILD done
      (`expo run:ios`). HomeScreen dropped the old TAB_BAR_CLEARANCE padding (native bar reserves its
      own space). NOTE: custom `GlassTabBar.js` is now UNUSED (and `expo-glass-effect`/`expo-blur`
      only served it) — delete if not reverting. Tradeoff accepted: no drag-to-switch, native styling.
- [ ] Build remaining screens — Plan Detail, Workout Detail, History, Profile, Settings, Calendar
      (now assembly from the component library)

## Product decisions (locked)
- **Units:** kg + lb toggle in Settings; default kg.
- **Routines:** user-built first (audience = intermediate/advanced lifters), plus optional pre-built routines.
- **Persistence:** Supabase (Postgres + auth). Build screens against mock data now via a data layer; wire `@supabase/supabase-js` later (needs user's project URL + anon key + SQL schema).

## App structure
- `App.js` → SafeAreaProvider → `src/navigation/RootNavigator.js`
- `src/screens/*` — one file per screen (currently placeholders)
- `src/components/ScreenPlaceholder.js` — temp stub, remove as screens get built
- `src/theme/*` — design tokens

## Run the app — DEVELOPMENT BUILD (no Expo Go on sim/Android)
We switched from Expo Go to a **development build** (expo-dev-client) so the app runs on
simulator + Android + phone regardless of Expo Go's SDK version. Native dirs `ios/` and
`android/` are generated by prebuild and git-ignored (regenerate with `npx expo prebuild`).

- **First build (compiles native, slow):**
  - iOS simulator:  `cd project/app && npx expo run:ios`
  - Android:        `cd project/app && ./scripts/run-android.sh`  (wires JDK + boots Pixel_7)
- **Day to day (after the dev app is installed):** `npx expo start --dev-client`, then open the
  installed **Reps** dev app on the simulator/emulator (JS hot-reloads from Metro).
- **Physical iPhone:** still runs via Expo Go (SDK 54) by scanning the QR. (A device dev build
  would need Apple signing — optional follow-up.)
- Android needs JDK + SDK env not on PATH by default; `scripts/run-android.sh` sets them
  (JAVA_HOME = Android Studio's bundled JBR / OpenJDK 21).

App identity: name "Reps", bundleIdentifier/package `com.reps.app`, dark UI.

## Design tokens — notes
- Brand confirmed orange-red `#F05305` (screenshot label "Sparkling Yellow" is wrong).
- Font strategy = PLATFORM-NATIVE: iOS uses the system font (real SF Pro, no fontFamily set);
  Android uses **Inter** (SF-Pro-alike, OFL — can't ship real SF Pro on Android, Apple license).
  Wired in `theme.js`: the `w()` helper sets a weight-specific `fontFamily` (Inter_400Regular …
  Inter_700Bold) + `fontWeight:'normal'` on Android only; iOS keeps fontWeight → native SF Pro cut.
  Fonts loaded in `App.js` via `useFonts` (Android map only; empty on iOS). Import Inter by
  SUBPATH (`@expo-google-fonts/inter/400Regular/...ttf`) — the package barrel bundles all ~24
  variants (~8 MB); subpaths bundle only the 4 we use. No native rebuild (expo-font already in build).
  iOS verified unchanged on simulator. ANDROID render (Inter) NOT yet verified on an emulator.
- Spacing (4-pt) is INFERRED, not measured — confirm against real screens.
- Radius matches the Figma system: lg=24 (big cards), md=18 (buttons & small controls), sm=10, pill.
  Hero/folder/session/routine cards use lg(24); AppButton uses md(18) — buttons are rounded-18
  rects, NOT pills. `Card` accepts a `cornerRadius` prop to override (e.g. Start Empty Workout
  passes radius.md=18). Plus a `borderCurve` token (= 'continuous') spread alongside every
  `borderRadius` in the shared components for SQUIRCLE corners. iOS renders the continuous curve;
  Android falls back to a normal arc. Chips remain pills.

## Open questions
- Persistence approach (local-only vs sync)?
- Exercise library: built-in list vs user-defined?
- Units: kg/lb toggle?

## Next step
User drops app screenshots into `project/brief/screenshots/`, then we inventory screens and extract the design system.

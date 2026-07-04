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
      `FolderCard` = true iOS-folder silhouette drawn with `react-native-svg` (v15.12.1, SDK-54
      pin, bundled in Expo Go): lighter back sheet (`colors.surfaceElevated`) + gradient front
      panel whose top-left tab drops via an S-curve shoulder (proportions DROP/TAB_END/SHOULDER
      in the file), hairline stroke, options icon + name + "N items". Sized via onLayout; path
      regenerates per card size. VERIFIED on the iOS sim (Library grid renders the folder
      silhouette) after the native rebuild; the stale old com.reps.app dev build (pre-bundle-id
      change) was still installed, grabbed the exp+reps:// launch URL and red-boxed RNSVG —
      uninstalled it from the sim, only com.nlanhson.reps remains. NOTE: first tab label kept as
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
- [x] REVERTED to EXPO GO for physical-iPhone viewing. The native tab bar above blocked Expo Go
      (`react-native-bottom-tabs` is a third-party native module, not in Expo Go) and the
      `expo-dev-client` made `expo start` target a dev build instead of Expo Go. Swapped the tab
      bar back to JS `@react-navigation/bottom-tabs` (`RootNavigator.js`, icons via `<Icon>` — SF
      Symbols still render in Expo Go through `expo-symbols`), removed deps `@bottom-tabs/react-navigation`,
      `react-native-bottom-tabs`, `expo-dev-client`, and dropped them from `app.json` plugins
      (plugins now just `expo-font`). Bundle verified (`expo export`, no errors). Trade-off: lost the
      native Liquid Glass tab bar; SF Symbols kept. Earlier cleanup also deleted unused `GlassTabBar.js`
      + `expo-blur`/`expo-glass-effect`. NOTE: the snap-bridge capture tooling (`hooks/useSnapTarget.ts`,
      `@unicorn-studio/snap-bridge`, `react-native-view-shot`) is unwired but intentionally kept.
- [x] RUNTIME UI-TIER SYSTEM added (`src/theme/`): `useUITier()` → `liquid-glass | material-you |
      fallback`, decided per launch from one binary (Expo Go→fallback; Reduce Transparency→fallback;
      iOS≥26 + isLiquidGlassAvailable→liquid-glass; Android≥31→material-you; else fallback). Reactive
      to Reduce Transparency. `TierProvider` (App.js) evaluates once; surfaces read `useTier()`. All
      per-tier styling centralized in `tiers.ts` + `TierSurface.tsx`. Glass = `expo-glass-effect`
      (GlassSurface, opacity always 1); Material You = `@pchmn/expo-material3-theme` (MaterialYouProvider);
      native deps lazy-required only on their tier so Expo Go/fallback never load them. Re-added
      `expo-dev-client`, `expo-constants`. Tiered: Card, ConfirmDialog, tab-bar bg, in-session rest
      bar (full); AppButton/Chip (Material You only). TODO: glass-on-controls + ScreenHeader bar.
      VERIFIED: tsc clean, expo export OK, Expo Go→fallback render (sim), and iOS 26.5 sim dev build →
      `liquid-glass` confirmed (env bare, isLiquidGlassAvailable true). NOT yet on the physical phone.
- [x] NATIVE LIQUID-GLASS TAB BAR (tiered). Re-added `react-native-bottom-tabs` +
      `@bottom-tabs/react-navigation` (config plugin auto-added to app.json). `src/navigation/
      NativeTabs.js` = native `createNativeBottomTabNavigator` (real iOS system tab bar → Liquid
      Glass floating pill on iOS 26, automatic). `RootNavigator` now has `JSTabs` (the normal JS
      `@react-navigation/bottom-tabs` fallback bar) + a `Tabs` chooser: on the `liquid-glass` tier it
      lazy-`require`s `NativeTabs` (so Expo Go / fallback never import the native module), else `JSTabs`.
      Removed the old `TierBarBackground` glass-fill hack (the native bar brings its own glass).
      Native-rebuilt (`expo run:ios`) — Build Succeeded, and the iOS 26.5 sim now shows the native
      Liquid Glass tab bar. tsc clean; `expo export` bundles (Expo Go `--go` fallback intact). Physical
      device still pending (cable + signing).
- [x] TAB BAR — extended to ANDROID + both ends verified. Chooser now renders the native bar on
      `liquid-glass` OR `material-you`, so Android 12+ dev builds get the native `BottomNavigationView`.
      `NativeTabs` is platform-aware: SF Symbols on iOS, async-loaded Ionicons ImageSources on Android
      (`@expo/vector-icons` has no sync getImageSource → load on mount, gate render briefly). Verified
      all three states: iOS 26 sim → Liquid Glass pill; Android (Pixel_7, API 37) dev build → native
      Material bar with tinted icons (Home active = orange); Expo Go (`--go`) → JS fallback bar, no
      crash (native module stays lazy/unimported). Android built via `./scripts/run-android.sh`
      (BUILD SUCCESSFUL). NOTE: native bar gated to iOS-glass + Android-12+; iOS<26 / Android<12 / Expo
      Go all use the JS fallback bar.
- [x] PLAN DETAIL screen built (`src/screens/PlanDetailScreen.js`) — opened from a Library
      folder (Home passes `{ id }`). Custom in-screen header (native stack header hidden for
      the route): ScreenHeader `back` variant now takes `trailingIcons=[{icon,onPress}]` for
      the share + options actions (share = new `arrow-redo-outline` Icon-map entry →
      SF `arrowshape.turn.up.right`; kebab renders as SF `ellipsis` — horizontal — per the
      existing map, iOS convention). Body = the routine's workouts as `RoutineRow`s
      (→ WorkoutDetail with the workout id) + ghost "Create New Workout" card (inert TODO —
      builder flow not designed yet). Mock data restructured: `src/data/mock.js` now exports
      `routines` (each with a `workouts` array — PPL and Arnold got plausible workout lists)
      + `getRoutine(id)`; `mainRoutine` and `library` are derived, so Home's shapes are
      unchanged. Verified: tsc clean, expo export OK, iOS 26.5 sim screenshot of the Arnold
      routine matches the design panel (temporarily set initialRouteName+initialParams to
      deep-open the screen, then reverted).
      NOTE (pre-existing, found while verifying): an earlier UNCOMMITTED change made
      `FolderCard` render via `react-native-svg`, but the sim dev build predated that dep —
      Home's Library folders showed "Unimplemented component: RNSVGSvgView" red boxes.
      Expo Go unaffected (bundles react-native-svg). Fixed by a native rebuild
      (`npx expo run:ios`) to compile RNSVG into the dev client.
- [x] PHYSICAL IPHONE dev build installed (iPhone 17, iOS 26.5.1, "iPhone của Son"). One-time
      setup done: Apple ID (nlanhson@gmail.com) added to Xcode → free Personal Team `99WVZS89CB`,
      Automatically-manage-signing + team set on the Reps target, Developer Mode enabled on the
      phone, developer cert trusted (Settings → VPN & Device Management). BUNDLE ID CHANGED
      `com.reps.app` → `com.nlanhson.reps` (Apple rejected com.reps.app — already registered to
      another team globally); synced in app.json (ios.bundleIdentifier + android.package) and the
      Xcode project. Built via `npx expo run:ios --device <udid>`. Dev client loads JS from Metro
      over Wi-Fi (`http://192.168.1.11:8081` — first connect was Enter-URL-manually + Allow Local
      Network; now remembered). FREE-ACCOUNT LIMIT: signature expires every ~7 days → replug +
      re-run `expo run:ios --device` to re-sign. Old `com.reps.app` app still installed on the
      simulator — stale, delete when convenient. (Also: `~/Library/Developer/Xcode/DerivedData`
      was deleted to free 23 GB disk — first rebuild of anything is from scratch.) Liquid-glass
      tier expected on the phone (iOS 26); visual confirmation pending a screenshot.
- [x] WORKOUT DETAIL screen built (`src/screens/WorkoutDetailScreen.js`) — opened from a
      Plan Detail row or the Home Workouts tab (both pass `{ id }`). Custom in-screen header
      (native stack header hidden): "Workout Detail" centered + kebab. Body: h2 workout name,
      "N exercises · 50-60 min" meta, metric Chips (Volume | Duration | Reps — switching
      re-renders the chart with that series' unit + nice-ceiling axis) with an orange
      "Last 3 months ⌄" range label (display-only), new `ProgressChart` component
      (`src/components/ProgressChart.js`, react-native-svg: accent 2px line + dot markers +
      vertical accent-fade area fill, 3 hairline gridlines, y labels in a 52px gutter, x date
      labels; axis text = textMuted `label` token per dataviz rules — single series so no
      legend; static, no touch layer until real history data), exercise list as gradient Cards
      (drag-vertical handle icon — reorder is a visual affordance only, TODO — ExerciseRow
      avatar+name+meta, kebab), pinned Start Workout AppButton → InSession. Icon map: added
      `drag-vertical` (MCI on both platforms — no SF six-dot exists). Mock: `getWorkout(id)` in
      `src/data/mock.js` — hand-written exercise lists for upper/lower + a generic pool
      fallback so every PPL/Arnold row renders; per-metric progress series
      (volume/duration/reps) + date labels, shapes kept Supabase-swappable. VERIFIED: tsc
      clean, expo export OK; sim (dev build) screenshots match the design panel for Volume
      AND Duration states (deep-opened via temp initialRouteName+initialParams, then reverted;
      metric flip verified by temporarily changing the useState default, then reverted).
- [x] DARK NATIVE UNDER-LAYERS — fixed the white layer + visible rounded corners during
      stack transitions (user saw it on the phone, Plan Detail → Home). Root cause: the native
      root view behind the RN tree was default WHITE — iOS 26's push/pop lifts screens as
      rounded cards and exposes it. The JS layer was already dark (navTheme + contentStyle);
      the fix had to be native: installed `expo-system-ui` (~6.0.9 — REQUIRED for expo config
      `backgroundColor` to work on iOS; without it prebuild ignores the key), set app.json
      `backgroundColor: #050505` + `splash.backgroundColor: #050505`, re-ran non-clean
      `npx expo prebuild -p ios` (Info.plist got `RCTRootViewBackgroundColor = 0xFF050505`;
      DEVELOPMENT_TEAM + bundle id survived). NOTE: the iOS 26 transition corner-radius itself
      is system chrome and cannot be disabled — dark-on-dark makes it invisible (screens were
      always full-bleed; the curve was transition-only). Verified on sim with burst screenshots
      via a TEMP auto push/pop in HomeScreen (reverted): launch loading page now dark (was
      full white), mid-pop frame shows no white anywhere. tsc clean. NATIVE CHANGE —
      **phone still shows the old white until its next cabled rebuild** (`expo run:ios --device`,
      can ride along with the next 7-day re-sign). Android gets the window color whenever its
      native project is next regenerated (android/ is stale re: bundle id anyway).
- [x] HISTORY screen built (`src/screens/HistoryScreen.js`) from FIGMA (first screen sourced
      from Figma, not screenshots): file `4Eb6v5kDDdOr3byPpXFyvE` "Reps-Fitness-App", node
      687-5226 "History" — the MCP account (hulusi.t@digitalunicorn.tech) was granted access
      mid-session; `project/brief/screenshots/` is now EMPTY, so Figma is the de-facto design
      source going forward. Screen = month navigator (chevrons page weeks, ends disabled) +
      `WeekStrip` + weekly workout logs paged horizontally (FlatList pagingEnabled, one page
      per week, swipe ⇄ chevrons share state; each page = SessionCards + a per-week footer
      note). Header "+" (log past workout) + card kebabs are inert TODOs — flows not designed.
      Components reshaped to the Figma spec: `WeekStrip` → day PILLS (surfaceElevated,
      radius.sm, hairline; weekday 12px + date h6 + 6px logged dot — accent normally, white on
      the accent-filled selected/today pill; cells only pressable if `onSelect` given);
      `SessionCard` → volume stat added (barbell icon; set count icon-less per design), meta
      text/icons = textPrimary, date = new `typography.captionSmall` (12px, added to theme.js
      from the existing body12 primitive), exercise rows now INLINE (32px circle thumb + "3 ×
      Name" + gray meta on one line — WorkoutDetail's stacked ExerciseRow untouched), expander
      centered gray with singular/plural handling, previewCount default 3. Mock:
      `src/data/history.js` — 2 weeks (Jun 22 + current Jun 29 2026), days/sessions/note per
      week, exercises derived from `getWorkout()`, `todayKey` drives the selected pill; shapes
      Supabase-swappable. Gallery sample data updated (logged dots + volume). DEVIATION kept:
      header title stays `ScreenHeader` largeTitle (34) for cross-tab consistency vs Figma's
      28 — flag if the 28px header should apply app-wide. VERIFIED: tsc clean, expo export OK,
      iOS 26.5 sim (liquid-glass) screenshot matches the Figma node render (deep-opened via
      temp NativeTabs initialRouteName, reverted). NOTE: another session was working in this
      tree concurrently (Metro already on 8081; WorkoutDetail + dark-under-layer entries above
      landed mid-session) — it removed its own TEMP-VERIFY navigation leftovers itself.
- [ ] Build remaining screens — Profile, Settings, Calendar
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

## Run the app — DUAL MODE (Expo Go fallback + dev build for the modern tiers)
The app now renders a runtime UI tier (`liquid-glass | material-you | fallback`, see below), so
there are two run paths from ONE binary:

- **Expo Go (always `fallback` tier):** `cd project/app && npx expo start --go`, then scan the QR on
  the iPhone, or press `i`/`a`. Fast, no build. NOTE: `expo-dev-client` is installed again, so plain
  `npx expo start` now defaults to **dev-build** mode — you must pass `--go` for Expo Go.
- **Dev build (modern tiers):** `npx expo run:ios` (simulator) or `npx expo run:ios --device`
  (physical iPhone — needs USB-C + free Apple ID signing in Xcode + Developer Mode/Trust). iOS 26 →
  `liquid-glass`, Android 12+ → `material-you`. After the first native build, `npx expo start
  --dev-client` hot-reloads JS into the installed dev app. Compiling Liquid Glass needs **Xcode 26**.
- `ios/`/`android/` are git-ignored, regenerated by prebuild / `expo run:*`.

App identity: name "Reps", bundleIdentifier/package `com.nlanhson.reps` (was `com.reps.app` — taken globally, changed for device signing), dark UI.

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

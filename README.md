# Medical Instrument Simulator - Phase 1

A web-based medical instrument simulator that replicates a polygraph/physiological monitoring interface with real-time moving signals and interactive features.

## Phase 1 Implementation Complete ✅

### What's Been Built

**Project Setup & Basic Structure:**
- ✅ Next.js 15.5.2 project with TypeScript
- ✅ Tailwind CSS for styling
- ✅ Framer Motion for animations
- ✅ Zustand for state management
- ✅ Proper project structure with organized folders

**React Component Structure:**
- ✅ Main layout components (Header, Sidebar, MainLayout)
- ✅ Sidebar with input panels and controlled inputs
- ✅ Toolbar components with menu buttons and playback controls
- ✅ Status bar component with subject information

**Styling Foundation:**
- ✅ Medical instrument color scheme
- ✅ Responsive grid layout using CSS Grid/Flexbox
- ✅ Styled input fields, buttons, and panels
- ✅ Grid background for chart area
- ✅ Hover effects and transitions with Framer Motion

### Key Features Implemented

1. **Interactive UI Panels (in Sidebar):**
   - Numerical scoring table (TR, AR, EDA, BP, PLE)
   - Question input with R1/R2 fields
   - EDA comments textarea
   - EDA ratios display
   - Totals calculation
   - Conclusion dropdown

2. **Chart Area:**
   - Canvas-based signal rendering
   - Grid background with time markers
   - Tab navigation (Arm, Chart 2, etc.)
   - Watermark overlay

3. **Interactive Features:**
   - Left-click to add green columns
   - Right-click to add red columns
   - Spacebar for signal distortion
   - Column removal by clicking

4. **Real-time Signals:**
   - 4 signal channels (2 breathing, 1 EDA, 1 pulse)
   - Smooth animation with proper frequencies (15 cycles/min for breathing, 72 bpm for pulse)
   - Real-time signal generation with continuous animation
   - Visual feedback for interactions
   - Signal distortion effects on spacebar press

5. **Professional UI:**
   - Medical instrument styling with CPSpro branding
   - Responsive design with proper grid layout
   - Smooth animations using Framer Motion
   - Professional color scheme (medical blues, greens, reds)
   - Watermark overlay on chart area
   - Status bar with subject information and playback controls

### How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Interactive Controls

- **Left Click**: Add green column marker
- **Right Click**: Add red column marker  
- **Spacebar**: Trigger signal distortion effect
- **Click Columns**: Remove column markers
- **Tab Navigation**: Switch between different chart views (Arm, Chart 2, etc.)
- **Playback Controls**: Play, pause, stop, and navigate through the timeline

### Technical Stack

- **Frontend**: React 19, Next.js 15, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Canvas**: HTML5 Canvas for signal rendering

### Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── ui/             # Basic UI components (Button, Input, Dropdown)
│   ├── chart/          # Chart and signal components (ChartArea, SignalCanvas, ColumnOverlay)
│   ├── panels/         # Empty directory (input panels are in Sidebar)
│   ├── toolbar/        # Menu and controls (MenuBar, StatusBar)
│   └── layout/         # Layout components (Header, Sidebar, MainLayout)
├── store/              # Zustand stores (simulatorStore, uiStore, types)
└── types/              # TypeScript type definitions
```

### Current Implementation Details

**State Management:**
- Zustand stores for simulator state and UI state
- Real-time signal generation with proper timing
- Column management with add/remove functionality
- Playback controls with play/pause/stop

**Signal Generation:**
- 4 distinct signal types with different characteristics
- Breathing signals: 15 cycles per minute with phase offset
- EDA signal: Complex waveform with multiple harmonics
- Pulse signal: 72 BPM with dual-frequency components
- Real-time distortion effects

**UI Components:**
- Responsive sidebar with all input panels
- Canvas-based chart rendering with smooth animations
- Interactive column overlay with click-to-remove
- Professional medical instrument styling
- Tab-based chart navigation



### Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Modern browsers with ES6+ support required.
# Medical Instrument Simulator - Phase 1

A web-based medical instrument simulator that replicates a polygraph/physiological monitoring interface with real-time moving signals and interactive features.

## Phase 1 Implementation Complete ✅

### What's Been Built

**Project Setup & Basic Structure:**
- ✅ Next.js 14+ project with TypeScript
- ✅ Tailwind CSS for styling
- ✅ Framer Motion for animations
- ✅ Zustand for state management
- ✅ Proper project structure with organized folders

**React Component Structure:**
- ✅ Main layout components (Header, Sidebar, MainLayout)
- ✅ Input panel components with controlled inputs
- ✅ Toolbar components with menu buttons and playback controls
- ✅ Status bar component with subject information

**Styling Foundation:**
- ✅ Medical instrument color scheme
- ✅ Responsive grid layout using CSS Grid/Flexbox
- ✅ Styled input fields, buttons, and panels
- ✅ Grid background for chart area
- ✅ Hover effects and transitions with Framer Motion

### Key Features Implemented

1. **Interactive UI Panels:**
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
   - Smooth animation with proper frequencies
   - Visual feedback for interactions

5. **Professional UI:**
   - Medical instrument styling
   - Responsive design
   - Smooth animations
   - Professional color scheme

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

### Technical Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Canvas**: HTML5 Canvas for signal rendering

### Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── ui/             # Basic UI components
│   ├── chart/          # Chart and signal components
│   ├── panels/         # Input panels
│   ├── toolbar/        # Menu and controls
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── store/              # Zustand stores
└── types/              # TypeScript type definitions
```

### Next Steps (Phase 2)

The foundation is now complete. Phase 2 will focus on:
- Enhanced signal generation algorithms
- Real-time animation system
- Performance optimization
- Advanced interactive features

### Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Modern browsers with ES6+ support required.
# Medical Instrument Simulator - Project Plan

## Project Overview
A web-based medical instrument simulator that replicates a polygraph/physiological monitoring interface with real-time moving signals and interactive features.

## Requirements Summary
- **4 Signal Channels**: 2 dark blue (breathing patterns), 1 green (skin response/EDA), 1 red (pulse rate)
- **Interactive Features**: Left-click for green columns, right-click for red columns, spacebar for signal distortion
- **UI Components**: Empty input panels, non-functional menu buttons
- **Real-time Animation**: Signals moving like actual medical instruments
- **No Data Processing**: Pure simulator with no backend functionality

## Technical Architecture

### Frontend Technology Stack
- **React 18+**: Component-based UI framework
- **Next.js 14+**: Full-stack React framework with SSR/SSG capabilities
- **TypeScript**: Type-safe development
- **HTML5 Canvas**: For high-performance signal rendering
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Zustand**: Lightweight state management
- **Web Audio API**: For potential audio feedback (optional)

### Project Structure
```
simulator/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Dropdown.tsx
│   │   ├── chart/
│   │   │   ├── SignalCanvas.tsx
│   │   │   ├── SignalRenderer.tsx
│   │   │   └── ColumnOverlay.tsx
│   │   ├── panels/
│   │   │   ├── ScoringPanel.tsx
│   │   │   ├── QuestionPanel.tsx
│   │   │   └── CommentsPanel.tsx
│   │   ├── toolbar/
│   │   │   ├── MenuBar.tsx
│   │   │   ├── PlaybackControls.tsx
│   │   │   └── StatusBar.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── MainLayout.tsx
│   ├── hooks/
│   │   ├── useSignalGenerator.ts
│   │   ├── useCanvas.ts
│   │   ├── useKeyboard.ts
│   │   └── useLocalStorage.ts
│   ├── lib/
│   │   ├── signalGenerator.ts
│   │   ├── canvasUtils.ts
│   │   ├── eventHandlers.ts
│   │   └── constants.ts
│   ├── store/
│   │   ├── simulatorStore.ts
│   │   └── types.ts
│   └── types/
│       └── index.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── README.md
```

## Implementation Plan (A-Z)

### Phase 1: Project Setup & Basic Structure
**A. Project Initialization**
- Initialize Next.js 14+ project with TypeScript
- Set up Tailwind CSS for styling
- Configure ESLint and Prettier
- Install required dependencies (Framer Motion, Zustand, etc.)
- Set up project structure with proper folder organization

**B. React Component Structure**
- Create main layout components (Header, Sidebar, MainLayout)
- Build input panel components with controlled inputs
- Create toolbar components with menu buttons and playback controls
- Add status bar component with subject information

**C. Styling Foundation**
- Configure Tailwind CSS with medical instrument color scheme
- Create responsive grid layout using CSS Grid/Flexbox
- Style input fields, buttons, and panels with Tailwind utilities
- Add grid background for chart area
- Implement hover effects and transitions with Framer Motion

### Phase 2: Canvas Implementation & Signal Generation
**D. React Canvas Component**
- Create SignalCanvas React component with useRef for canvas access
- Implement canvas scaling and responsive design with useEffect
- Set up drawing context and performance optimization
- Add grid lines and time axis markers with custom hooks

**E. Signal Generator Hook**
- Create useSignalGenerator custom hook for signal management
- Implement mathematical functions for each signal type:
  - **Breathing Pattern 1 (Upper Belly)**: Sinusoidal with slight variations
  - **Breathing Pattern 2 (Lower Belly)**: Phase-shifted sinusoidal (connected to Pattern 1)
  - **Skin Response (EDA)**: Smooth undulating pattern with occasional peaks
  - **Pulse Rate**: High-frequency oscillating pattern
- Use Zustand store for signal state management
- Add random variations for natural movement

**F. Real-time Animation System**
- Implement useAnimationFrame custom hook for smooth 60fps animation
- Use React state and useEffect for signal data buffer management
- Create time-based progression system with performance monitoring
- Add React.memo optimization for canvas rendering

### Phase 3: Interactive Features
**G. React Event Handling**
- Create useMouseEvents custom hook for canvas interactions
- Implement left-click detection for green column placement
- Add right-click detection for red column placement
- Create column positioning system with snap-to-grid using React state
- Implement column visual feedback with Framer Motion animations

**H. Keyboard Event Handling**
- Create useKeyboard custom hook for global keyboard events
- Add spacebar detection for signal distortion effect
- Implement distortion algorithm using Zustand store updates
- Create visual feedback for distortion events with React state
- Add keyboard shortcuts for other interactions

**I. Column Management System**
- Create Zustand store for column data management
- Implement ColumnOverlay React component for rendering
- Add column removal functionality with React event handlers
- Create useLocalStorage hook for column persistence

### Phase 4: UI Components & Panels
**J. React Panel Components**
- Create ScoringPanel component with controlled inputs
- Implement QuestionPanel with React state management
- Add CommentsPanel with textarea and controlled state
- Create EDA ratios table with calculated values using useMemo
- Implement totals calculation with React state updates
- Add conclusion dropdown with React Select component

**K. React Menu System**
- Create MenuBar component with non-functional buttons
- Implement hover effects with Framer Motion
- Add toolbar icons with proper Tailwind styling
- Create responsive menu layout with React state

**L. React Playback Controls**
- Implement PlaybackControls component with state management
- Add time display and progress tracking with useEffect
- Create speed control options with React state
- Implement skip functionality with Zustand store updates

### Phase 5: Advanced Features & Polish
**M. React Signal Customization**
- Add amplitude adjustment controls with React state
- Implement frequency modification options with Zustand store
- Create signal visibility toggles with React components
- Add signal color customization with React state management

**N. React Data Persistence**
- Implement useLocalStorage hook for saving interface state
- Add session management with React Context API
- Create export functionality using React state serialization
- Implement import/restore functionality with file upload

**O. React Performance Optimization**
- Optimize canvas rendering with React.memo and useMemo
- Implement signal data compression with custom hooks
- Add memory management with useEffect cleanup
- Create performance monitoring with React DevTools integration

### Phase 6: Testing & Quality Assurance
**P. React Testing**
- Set up Jest and React Testing Library
- Write unit tests for custom hooks and components
- Test on Chrome, Firefox, Safari, Edge
- Verify mobile responsiveness with React testing

**Q. React User Experience Testing**
- Test signal realism and smoothness with React DevTools
- Verify interactive feature responsiveness
- Check visual consistency across React components
- Validate keyboard and mouse interactions with React events

**R. React Performance Testing**
- Monitor memory usage with React Profiler
- Test with multiple simultaneous signals using React.memo
- Verify smooth animation at 60fps with React optimization
- Check CPU usage optimization with React DevTools

### Phase 7: Documentation & Deployment
**S. React Documentation**
- Create user manual for simulator features
- Document React component architecture and props
- Add TypeScript interfaces and JSDoc comments
- Create troubleshooting guide for React-specific issues

**T. Next.js Deployment Preparation**
- Optimize assets with Next.js Image component
- Create production build with `next build`
- Set up Vercel deployment configuration
- Implement error handling with React Error Boundaries

## Technical Specifications

### Signal Characteristics
- **Breathing Pattern 1**: 12-20 cycles/min, amplitude 0.5-1.5 units
- **Breathing Pattern 2**: 12-20 cycles/min, 0.2-0.5 second phase delay
- **Skin Response (EDA)**: 0.1-0.5 Hz, smooth transitions with occasional spikes
- **Pulse Rate**: 60-100 bpm, high-frequency oscillations

### Performance Requirements
- **Frame Rate**: 60fps for smooth animation
- **Memory Usage**: < 100MB for extended sessions
- **Load Time**: < 3 seconds on standard broadband
- **Browser Support**: Modern browsers (ES6+ support)

### Interactive Features
- **Column Width**: 2-3 seconds of signal data
- **Distortion Duration**: 0.5-2 seconds
- **Click Tolerance**: 5px radius for precise placement
- **Keyboard Response**: < 100ms latency

## Development Timeline
- **Phase 1-2**: 2-3 days (Next.js setup and React components)
- **Phase 3**: 2-3 days (Interactive features with React hooks)
- **Phase 4**: 2-3 days (React UI components)
- **Phase 5**: 2-3 days (Advanced React features)
- **Phase 6**: 1-2 days (React testing)
- **Phase 7**: 1 day (Next.js deployment)

**Total Estimated Time**: 10-15 days (faster with React/Next.js)

## Risk Mitigation
- **Performance Issues**: Use React.memo, useMemo, and useCallback for optimization
- **Browser Compatibility**: Next.js handles polyfills and browser compatibility
- **Memory Leaks**: Implement proper useEffect cleanup and React best practices
- **User Experience**: Use React DevTools and Framer Motion for smooth interactions

## Success Criteria
- ✅ Realistic signal movement matching medical instruments
- ✅ Smooth 60fps animation performance
- ✅ Responsive interactive features (click, spacebar)
- ✅ Accurate UI replication from reference image
- ✅ Cross-browser compatibility
- ✅ Mobile-responsive design
- ✅ No functional backend requirements met

## React/Next.js Benefits
- **Component Reusability**: Modular UI components for easy maintenance
- **Type Safety**: TypeScript integration for better development experience
- **Performance**: React optimization features and Next.js built-in optimizations
- **Developer Experience**: Hot reloading, DevTools, and modern tooling
- **SEO Ready**: Next.js SSR/SSG capabilities if needed
- **Easy Deployment**: Vercel integration for seamless deployment

## Future Enhancements (Optional)
- Audio feedback for signal events using Web Audio API
- Advanced signal analysis tools with React components
- Data export capabilities with React state serialization
- Multi-session management using React Context
- Custom signal templates with React forms
- Real-time collaboration features with WebSockets

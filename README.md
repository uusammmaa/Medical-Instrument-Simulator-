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

## Deployment

### Production Deployment (Vercel)

The application is currently deployed on Vercel and accessible at:
- **Production URL**: https://medical-instrument-simulator.vercel.app/
- **Vercel Dashboard**: https://vercel.com/usamaakram17-gmailcoms-projects/medical-instrument-simulator

### Deployment Configuration

**Project Details:**
- **Project Name**: medical-instrument-simulator
- **Organization**: usamaakram17-gmailcoms-projects
- **Project ID**: prj_mho0DMoV82EugMECOhGVyTrTJNWH
- **Organization ID**: team_0zdqliqeZI2qSXzN6pGxUiXO

### Deployment Commands

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

3. **Deploy Preview (Development):**
   ```bash
   vercel
   ```

### Deployment Process

1. **Prerequisites:**
   - Vercel CLI installed globally: `npm install -g vercel`
   - Authenticated with Vercel account
   - Project linked to Vercel (`.vercel` folder present)

2. **Build Configuration:**
   - Framework: Next.js 15.5.2
   - Build Command: `next build --turbopack`
   - Output Directory: `.next`
   - Install Command: `npm install` (or `pnpm install`)

3. **Environment Variables:**
   - No environment variables currently required
   - Add any required environment variables through Vercel dashboard

### Deployment Notes for Future Developers

**Important Files:**
- `.vercel/project.json` - Contains project configuration
- `vercel.json` - Custom Vercel configuration (if needed)
- `next.config.ts` - Next.js configuration

**Deployment Checklist:**
- [ ] Ensure all dependencies are in `package.json`
- [ ] Run `npm run build` locally to verify build works
- [ ] Check for any TypeScript errors: `npm run lint`
- [ ] Test the application locally: `npm run dev`
- [ ] Commit all changes to git
- [ ] Run `vercel --prod` to deploy

**Troubleshooting:**
- If deployment fails, check the Vercel dashboard for build logs
- Ensure all environment variables are set in Vercel dashboard
- Verify that the build command works locally
- Check for any missing dependencies or TypeScript errors

**Automatic Deployments:**
- Connect GitHub repository to Vercel for automatic deployments
- Each push to main branch will trigger a production deployment
- Pull requests will create preview deployments

**Performance Optimization:**
- The app uses Next.js 15 with Turbopack for faster builds
- Static assets are automatically optimized by Vercel
- Consider implementing ISR (Incremental Static Regeneration) for better performance

**Monitoring:**
- Use Vercel Analytics for performance monitoring
- Check Vercel dashboard for deployment status and logs
- Monitor Core Web Vitals through Vercel's built-in analytics
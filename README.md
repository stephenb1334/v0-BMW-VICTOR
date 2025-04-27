# BMW X6 2025 AR Dashboard Tutorial

An interactive AR tutorial application for the BMW X6 dashboard, built with Next.js, React Three Fiber, and TailwindCSS.

## Project Overview

This application provides an interactive AR experience to help BMW X6 owners learn about their vehicle's dashboard features. The tutorial includes:

- 10 standard learning modules covering all dashboard features
- 1 bonus "Cat Command" module for fun
- Interactive AR overlays on the dashboard
- Voice narration with a sassy, playful personality
- Quiz interactions to test knowledge
- Progress tracking

## Technical Details

- **Framework**: Next.js (React)
- **UI Library**: TailwindCSS with shadcn/ui components
- **AR Support**: WebXR Polyfill + React Three Fiber
- **Camera Mode**: UltraWide 13mm (0.5x zoom locked)
- **Progress Saving**: LocalStorage
- **Routing**: Next.js App Router

## Modules

1. Dashboard Overview
2. Understanding the Instrument Cluster
3. Center Infotainment System Basics
4. Climate Control and Comfort Settings
5. Exploring BMW Drive Modes
6. Connecting Your Phone
7. Mastering Voice Commands
8. Using Parking Assistance and Backup Cameras
9. Customizing Ambient Lighting
10. Saving Your Driver Profile
11. Bonus Module: Cat Command!

## Features

- **AR Hotspots**: Interactive hotspots overlay on the dashboard
- **Voice Narration**: Sassy voice guidance throughout the tutorial
- **Quiz Integration**: Knowledge checks after each module
- **Progress Tracking**: Save and resume tutorial progress
- **Fallback Mode**: Camera-free mode for devices without camera access
- **Bonus Module**: Fun "Cat Command" module with 3D cat ejection simulation

## Deployment

The application is deployed on Vercel Edge CDN with the following performance targets:
- First paint: under 1.5s
- Lighthouse score minimum: 95

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## License

This project is proprietary and confidential. All rights reserved.
\`\`\`

Finally, let's create a cat model placeholder for the bonus module:

```plaintext file="public/cat-model.glb" query="3D model of a cartoon cat sitting"

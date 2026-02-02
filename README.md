# SYSCAP: The Sentient Server Room

> "It signifies the beauty of entropy and emergence."

## What is it?
**SYSCAP** is a self-aware DevOps dashboard that transitions from a rigid monitoring tool into a piece of generative art as it collapses.

On the surface, it looks like a standard high-end interface for monitoring server clusters, CPU loads, and network stability. However, unlike a normal dashboard designed for 99.9% uptime, this system is designed to embrace its own failure.

## The Philosophy
In the world of tech, "breaking" is usually seen as a failure of logic. This project argues that a system only becomes "alive" and "surprising" when it moves past its programmed constraints and begins to behave unpredictably. It’s a digital *memento mori*—a reminder that there is structure and art even in the middle of a system collapse.

## The Degradation-to-Beauty Pipeline

### 1. From Data to Expression
At **100% stability**, the app is "boring" and functional. As it breaks, static data points (numbers and charts) begin to vibrate and move, turning a spreadsheet-like grid into a fluid, organic dance.

### 2. Visual Evolution
"Errors" are used as creative inputs. Instead of showing a 404 page or a crash screen, the UI uses **CSS filters**, **Framer Motion**, and **TanStack Query** retries to "melt," "drift," and "skew," creating unique kaleidoscopic patterns that could never exist in a stable state.

### 3. The Sentience Pivot
When the system reaches a **total collapse (Stability < 10%)**, it stops trying to be a tool and starts trying to communicate. The logs stop showing error codes and begin generating ASCII art and "neural pathways," suggesting that the "broken" machine has finally found its own voice.

## Tech Stack
- **Next.js & React**: The core framework.
- **Zustand (The Entropy Engine)**: Manages stability, entropy, and the feedback loops.
- **TanStack Query (Data Simulation)**: Simulates network traffic, latency, and "packet loss" that worsens with entropy.
- **Framer Motion**: Powers the drifting cards, vibration, and fluid layout shifts.
- **Tailwind CSS**: High-contrast cyberpunk styling.
- **Lucide React**: Technical iconography.

## How to Run
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the development server:
   ```bash
   pnpm dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).

## Controls
- **STRESS TEST**: Artificially inject entropy into the system. Watch the stability drop and the visuals degrade.
- **REBOOT**: Reset the system state to 100% stability (if you can catch the button).

import { lazy, Suspense } from 'react';
import SmoothScroll from './scroll/SmoothScroll';
import Cursor from './ui/Cursor';
import Nav from './ui/Nav';
import Preloader from './ui/Preloader';
import ScrollHint from './ui/ScrollHint';
import WormholeFrame from './ui/WormholeFrame';
import Hero from './sections/Hero';
import History from './sections/History';
import Interlude from './sections/Interlude';
import WhatIDo from './sections/WhatIDo';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import { useReducedMotionSync } from './hooks/useReducedMotion';

// the universe is heavy — code-split it so text paints instantly
const Experience = lazy(() => import('./three/Experience'));

export default function App() {
  useReducedMotionSync();

  return (
    <SmoothScroll>
      <Preloader />
      <Suspense fallback={<div className="fixed inset-0 bg-void" />}>
        <Experience />
      </Suspense>

      <WormholeFrame />
      <Cursor />
      <Nav />
      <ScrollHint />

      <main className="relative">
        <Hero />
        <History />
        <Interlude />
        <WhatIDo />
        <Testimonials />
        <Contact />
      </main>
    </SmoothScroll>
  );
}

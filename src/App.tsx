import { lazy, Suspense } from 'react';
import SmoothScroll from './scroll/SmoothScroll';
import AudioToggle from './ui/AudioToggle';
import Cursor from './ui/Cursor';
import Nav from './ui/Nav';
import Preloader from './ui/Preloader';
import ScrollHint from './ui/ScrollHint';
import Hero from './sections/Hero';
import History from './sections/History';
import Skills from './sections/Skills';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import { useReducedMotionSync } from './hooks/useReducedMotion';

// the universe is heavy — code-split it so the text layer paints instantly
const Experience = lazy(() => import('./three/Experience'));

export default function App() {
  useReducedMotionSync();

  return (
    <SmoothScroll>
      <Preloader />
      <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
        <Experience />
      </Suspense>

      <Cursor />
      <Nav />
      <ScrollHint />
      <AudioToggle />

      <main className="relative">
        <Hero />
        <History />
        <Skills />
        <Testimonials />
        <Contact />
      </main>
    </SmoothScroll>
  );
}

/**
 * MONUMENT — a procedural Three.js showcase game.
 * Entry point: boots the Game state machine against the DOM shell.
 *
 * Everything on screen is generated at runtime — no textures, no
 * models, no images. Vanilla Three.js + GSAP + custom GLSL only.
 */
import './ui/ui.css';
import { Game } from './core/Game.js';

const canvas = document.getElementById('game-canvas');
const uiRoot = document.getElementById('ui-root');

const game = new Game(canvas, uiRoot);
game.boot();

// dev/testing hook: /game/?autostart skips the start screen
if (new URLSearchParams(location.search).has('autostart')) {
  setTimeout(() => game.start(), 400);
}

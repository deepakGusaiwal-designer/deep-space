import React from "react";

function TopHeader({
  isPlaying,
  freqBars,
}) {
  return (
    <header className="top-header">
      {/* Top-Center Audio Visualizer Deck */}
      <div className="top-center-deck">
        <div
          className="equalizer-box"
          title={isPlaying ? "Live Audio Spectrum" : "Audio Spectrum (Idle)"}
        >
          <span className="eq-label" aria-hidden="true">EQ</span>
          <div className="eq-bars-wrap" aria-hidden="true">
            {freqBars.map((height, idx) => (
              <div key={idx} className="eq-bar" style={{ height: `${height}px` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Navigation Links */}
      <nav className="nav-links" aria-label="Quick Links">
        <a href="/" className="nav-pill" title="Return to Portfolio">
          <span className="nav-arrow">←</span>
          <span className="nav-text">Portfolio</span>
        </a>
        <a href="/game/" className="nav-pill nav-pill-game" title="Play Space Game">
          <span className="nav-game-title">Space Game</span>
          <span className="nav-game-icon">⚡</span>
        </a>
      </nav>
    </header>
  );
}

export default React.memo(TopHeader);

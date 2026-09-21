import React, { useEffect, useRef } from "react";

function HeroOverlay({ currentPlaylist }) {
  const cardRef = useRef(null);

  useEffect(() => {
    let animId;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onPointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = nx * -16; // Opposite parallax drift in px
      targetY = ny * -12;
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      if (cardRef.current) {
        cardRef.current.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  if (!currentPlaylist) return null;

  return (
    <div ref={cardRef} className="hero-overlay" style={{ willChange: "transform" }}>
      <span className="hero-subtitle">VINTAGE CASSETTE RADIO</span>
      <h1 className="hero-heading">{currentPlaylist.shortTitle}</h1>
      <p className="hero-desc">
        <span className="hero-desc-desktop">
          Streaming Playlist: {currentPlaylist.name}
          <br />
          Click buttons on model or bottom deck. Rotate knobs to seek.
        </span>
        <span className="hero-desc-mobile">
          Streaming: {currentPlaylist.name}
        </span>
      </p>
    </div>
  );
}

export default React.memo(HeroOverlay);

import React from "react";

function TuningLoader({ isLoading, currentPlaylist }) {
  if (!isLoading || !currentPlaylist) return null;

  return (
    <div className="tuning-loader-overlay" aria-live="polite">
      <div className="tuning-loader-card">
        <div className="tuning-cassette-spinner">
          <div className="cassette-reel reel-left" />
          <div className="cassette-reel reel-right" />
        </div>
        <div className="tuning-loader-badge">
          {currentPlaylist.icon} {currentPlaylist.shortTitle}
        </div>
        <div className="tuning-loader-frequency">
          FM {currentPlaylist.tuning || "98.0"} MHz
        </div>
        <div className="tuning-loader-playlist-name">{currentPlaylist.name}</div>
        <div className="tuning-loader-text">TUNING STATION & BUFFERING AUDIO...</div>
        <div className="tuning-loader-bar">
          <div className="tuning-loader-progress" />
        </div>
      </div>
    </div>
  );
}

export default React.memo(TuningLoader);

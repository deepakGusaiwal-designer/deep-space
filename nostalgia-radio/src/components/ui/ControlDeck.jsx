import React from "react";
import {
  Power,
  Volume2,
  VolumeX,
  Zap,
  SkipBack,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Square,
} from "lucide-react";

function ControlDeck({
  isPlaying,
  isMuted,
  bassBoost,
  handleButtonAction,
}) {
  return (
    <>
      {/* Floating Bottom-Center Capsule Pill Dock */}
      <nav className="capsule-pill-dock" role="toolbar" aria-label="Boombox Media Controls">
        {/* Power */}
        <button
          className={`capsule-btn ${isPlaying ? "active-pill-item is-power" : ""}`}
          onClick={() => handleButtonAction("power")}
          title="Power Standby / On"
          aria-label="Power"
        >
          <Power size={17} className="capsule-icon" />
          <span className="capsule-tooltip">POWER</span>
        </button>

        {/* Mute */}
        <button
          className={`capsule-btn ${isMuted ? "active-pill-item is-muted" : ""}`}
          onClick={() => handleButtonAction("mute")}
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
          aria-label="Mute"
        >
          {isMuted ? (
            <VolumeX size={17} className="capsule-icon" />
          ) : (
            <Volume2 size={17} className="capsule-icon" />
          )}
          <span className="capsule-tooltip">{isMuted ? "UNMUTE" : "MUTE"}</span>
        </button>

        {/* Bass Boost */}
        <button
          className={`capsule-btn ${bassBoost > 0 ? "active-pill-item is-bass" : ""}`}
          onClick={() => handleButtonAction("stereo")}
          title="Stereo Bass Boost (+8dB)"
          aria-label="Bass Boost"
        >
          <Zap size={17} className="capsule-icon" />
          <span className="capsule-tooltip">BASS +8dB</span>
        </button>

        <div className="capsule-divider" aria-hidden="true" />

        {/* Previous Track */}
        <button
          className="capsule-btn"
          onClick={() => handleButtonAction("prev")}
          title="Previous Track"
          aria-label="Previous Track"
        >
          <SkipBack size={17} className="capsule-icon" />
          <span className="capsule-tooltip">PREV</span>
        </button>

        {/* Play / Pause Toggle */}
        <button
          className={`capsule-btn ${isPlaying ? "active-pill-item is-playing" : ""}`}
          onClick={() => handleButtonAction("play")}
          title={isPlaying ? "Pause Radio" : "Play Radio"}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={17} className="capsule-icon" />
          ) : (
            <Play size={17} fill="currentColor" className="capsule-icon" />
          )}
          <span className="capsule-tooltip">{isPlaying ? "PAUSE" : "PLAY"}</span>
        </button>

        {/* Rewind */}
        <button
          className="capsule-btn"
          onClick={() => handleButtonAction("rewind")}
          title="Rewind Track to Start 00:00"
          aria-label="Rewind"
        >
          <RotateCcw size={17} className="capsule-icon" />
          <span className="capsule-tooltip">REWIND</span>
        </button>

        {/* Next Track */}
        <button
          className="capsule-btn"
          onClick={() => handleButtonAction("next")}
          title="Next Track"
          aria-label="Next Track"
        >
          <SkipForward size={17} className="capsule-icon" />
          <span className="capsule-tooltip">NEXT</span>
        </button>

        {/* Stop */}
        <button
          className="capsule-btn"
          onClick={() => handleButtonAction("stop")}
          title="Stop Audio / Reset"
          aria-label="Stop"
        >
          <Square size={13} fill="currentColor" className="capsule-icon" />
          <span className="capsule-tooltip">STOP</span>
        </button>
      </nav>
    </>
  );
}

export default React.memo(ControlDeck);

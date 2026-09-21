import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { RADIO_PLAYLISTS, getInitialStation, getStationUrl } from "./constants/radioPlaylists";
import Scene from "./components/canvas/Scene";
import NeonSoundwaveVisualizer from "./components/ui/NeonSoundwaveVisualizer";
import TopHeader from "./components/ui/TopHeader";
import ControlDeck from "./components/ui/ControlDeck";
import TuningLoader from "./components/ui/TuningLoader";
import "./styles.css";

export default function App() {
  const clickRef = useRef(null);
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const bassFilterRef = useRef(null);
  const analyserRef = useRef(null);

  // Shared FFT & Oscilloscope Data Buffers for 100% unified visualizer
  const freqDataRef = useRef(new Uint8Array(64));
  const timeDataRef = useRef(new Uint8Array(64));
  const rafRef = useRef(null);

  // Persistent YouTube Player References
  const ytPlayerRef = useRef(null);
  const isYtReadyRef = useRef(false);
  const pendingAutoplayRef = useRef(false);

  // Single Curated Playlist: 90s Bollywood Love Classics
  const currentPlaylist = RADIO_PLAYLISTS.love;

  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);

  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);

  // Live Track Progress & Accurate Seek State
  const [trackProgress, setTrackProgress] = useState({ currentTime: 0, duration: 0, title: "" });
  const lastSeekTargetRef = useRef(null);
  const lastSeekTimestampRef = useRef(0);

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) secs = 0;
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Knob States initialized to current station specs
  const [volume, setVolume] = useState(80);
  const volumeRef = useRef(80);

  const [tuning, setTuning] = useState(currentPlaylist.tuning || 94.6);
  const [bassBoost, setBassBoost] = useState(6);

  // High-performance Audio Reactivity Refs (Eliminates 60fps React state re-renders)
  const audioDataRef = useRef({ bass: 0, kick: 0 });
  const lastEqUpdateRef = useRef(0);
  const [freqBars, setFreqBars] = useState([4, 6, 8, 5, 7, 4, 6, 5]);

  // Keep refs in sync with state for zero stale closures
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Audio Context Setup for visualizers & filters
  const setupAudio = async () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const masterGain = audioCtx.createGain();
      masterGain.gain.value = volume / 100;
      masterGainRef.current = masterGain;

      const bassFilter = audioCtx.createBiquadFilter();
      bassFilter.type = "lowshelf";
      bassFilter.frequency.value = 180;
      bassFilter.gain.value = bassBoost;
      bassFilterRef.current = bassFilter;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.85;
      analyserRef.current = analyser;

      analyser.connect(bassFilter);
      bassFilter.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    }

    const audioCtx = audioContextRef.current;
    if (audioCtx && audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    setStarted(true);
  };

  // Show brief retro dial tuning transition on initial subpage mount
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Ambient Parallax Pointer Variable Updater (Smooth 60fps damped CSS variables)
  useEffect(() => {
    let animId;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onPointerMove = (e) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const loop = () => {
      animId = requestAnimationFrame(loop);
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      const root = document.documentElement;
      root.style.setProperty("--pointer-x", cx.toFixed(3));
      root.style.setProperty("--pointer-y", cy.toFixed(3));
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  // Dedicated YouTube IFrame Controller Lifecycle (Mounts once for assigned station playlist)
  useEffect(() => {
    let isMounted = true;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (ytPlayerRef.current) return;

      try {
        ytPlayerRef.current = new window.YT.Player("yt-boombox-player", {
          height: "240",
          width: "240",
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (!isMounted) return;
              isYtReadyRef.current = true;
              try {
                event.target.unMute();
                event.target.setVolume(isMutedRef.current ? 0 : volumeRef.current);

                event.target.cuePlaylist({
                  list: currentPlaylist.playlistId,
                  listType: "playlist",
                  index: 0,
                  startSeconds: 0,
                });

                if (pendingAutoplayRef.current) {
                  event.target.playVideo();
                  setIsPlaying(true);
                  pendingAutoplayRef.current = false;
                }
              } catch (e) {
                console.warn("YouTube player onReady error:", e);
              }
            },
            onStateChange: (event) => {
              if (!isMounted) return;
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setIsLoading(false);
                const title = event.target.getVideoData()?.title;
                if (title) setStatusText(`NOW PLAYING: ${title}`);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                if (typeof event.target.nextVideo === "function") {
                  event.target.nextVideo();
                }
              } else if (event.data === window.YT.PlayerState.CUED || event.data === -1) {
                if (isPlayingRef.current) {
                  try { event.target.playVideo(); } catch (e) {}
                }
              }
            },
            onError: (event) => {
              console.warn("YouTube player error code:", event.data);
              // Error 150/101 (embed restricted), 100 (not found), 2 (invalid param/blocked) -> auto-skip to next video
              if (typeof event.target.nextVideo === "function") {
                setTimeout(() => {
                  try { event.target.nextVideo(); } catch (e) {}
                }, 300);
              }
            },
          },
        });
      } catch (e) {
        console.warn("YT.Player init error:", e);
      }
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else if (window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Update volume & mute in YouTube Player
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      const gainVal = isPlaying && !isMuted ? volume / 100 : 0;
      masterGainRef.current.gain.setTargetAtTime(gainVal, audioContextRef.current.currentTime, 0.05);
    }

    if (ytPlayerRef.current && isYtReadyRef.current && typeof ytPlayerRef.current.setVolume === "function") {
      try {
        if (isMuted) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(volume);
        }
      } catch (e) {}
    }
  }, [volume, isPlaying, isMuted]);

  // Bass boost Web Audio filter
  useEffect(() => {
    if (bassFilterRef.current && audioContextRef.current) {
      bassFilterRef.current.gain.setTargetAtTime(bassBoost, audioContextRef.current.currentTime, 0.05);
    }
  }, [bassBoost]);

  // Track Progress Poller (Every 300ms when playing)
  useEffect(() => {
    let intervalId;
    const updateProgress = () => {
      const playlist = currentPlaylist;
      const player = ytPlayerRef.current;
      if (player && isYtReadyRef.current) {
        try {
          const cur = typeof player.getCurrentTime === "function" ? player.getCurrentTime() || 0 : 0;
          const dur = typeof player.getDuration === "function" ? player.getDuration() || 0 : 0;
          let title = playlist.name;
          if (typeof player.getVideoData === "function") {
            const ytTitle = player.getVideoData()?.title;
            if (ytTitle) title = ytTitle;
          }
          setTrackProgress({ currentTime: cur, duration: dur, title });
        } catch (e) {}
      }
    };

    if (isPlaying) {
      updateProgress();
      intervalId = setInterval(updateProgress, 300);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, currentPlaylist]);

  // Dynamic Audio Reactivity & Spectrum Meter Generator (Fully optimized: 0 React re-renders for bass/kick)
  useEffect(() => {
    const updateAudioMeters = () => {
      const freqData = freqDataRef.current;
      const timeData = timeDataRef.current;

      if (isPlayingRef.current) {
        const t = Date.now() * 0.005;
        const beat1 = Math.sin(t * 4.2) * 0.5 + 0.5;
        const beat2 = Math.sin(t * 8.4) * 0.5 + 0.5;
        const currentBass =
          (Math.sin(t * 2.1) * 0.3 + 0.5) * (0.6 + 0.4 * beat1) * (volumeRef.current / 100);
        const kickImpulse = Math.pow(beat1, 4) * 0.85;

        // Directly update audioDataRef without triggering React component re-renders
        audioDataRef.current.bass = currentBass;
        audioDataRef.current.kick = kickImpulse;

        // Throttle UI Equalizer updates to ~15fps (every 65ms) to prevent unnecessary React renders
        const now = Date.now();
        if (now - lastEqUpdateRef.current > 65) {
          lastEqUpdateRef.current = now;
          const bars = [
            Math.floor(10 + 16 * beat1),
            Math.floor(12 + 14 * beat2),
            Math.floor(8 + 18 * Math.sin(t * 5.5) * 0.5 + 9),
            Math.floor(14 + 12 * Math.sin(t * 3.3) * 0.5 + 6),
            Math.floor(11 + 15 * beat1),
            Math.floor(9 + 17 * beat2),
            Math.floor(13 + 13 * Math.sin(t * 6.2) * 0.5 + 6.5),
            Math.floor(10 + 14 * Math.sin(t * 4.8) * 0.5 + 7),
          ];
          setFreqBars(bars);
        }

        // Populate synthesized FFT buffers so NeonSoundwaveVisualizer is 100% active
        for (let i = 0; i < 64; i++) {
          const wave = Math.sin(t * 3.2 + (i / 64) * Math.PI * 4) * (55 * currentBass);
          freqData[i] = Math.max(0, Math.min(255, Math.floor(120 + wave + beat1 * 50)));
          timeData[i] = Math.max(
            0,
            Math.min(
              255,
              Math.floor(128 + Math.sin(t * 4.0 + (i / 64) * Math.PI * 6) * 45 * currentBass)
            )
          );
        }
      } else {
        audioDataRef.current.bass = 0;
        audioDataRef.current.kick = 0;
        if (freqData) freqData.fill(0);
        if (timeData) timeData.fill(128);
      }

      rafRef.current = requestAnimationFrame(updateAudioMeters);
    };

    updateAudioMeters();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Track Seek Handler
  const handleSeek = useCallback((deltaSeconds) => {
    try {
      const now = Date.now();
      const icon = deltaSeconds > 0 ? "⏩" : "⏪";
      const sign = deltaSeconds > 0 ? "+" : "";
      const player = ytPlayerRef.current;
      if (!player || !isYtReadyRef.current) return null;

      const liveCur =
        (typeof player.getCurrentTime === "function" ? player.getCurrentTime() : 0) || 0;
      const dur = (typeof player.getDuration === "function" ? player.getDuration() : 0) || 300;

      let baseTime = liveCur;
      if (lastSeekTargetRef.current !== null && now - lastSeekTimestampRef.current < 1500) {
        baseTime = lastSeekTargetRef.current;
      }

      const maxDur = dur > 0 ? dur - 1 : 3600;
      const target = Math.max(0, Math.min(maxDur, baseTime + deltaSeconds));
      lastSeekTargetRef.current = target;
      lastSeekTimestampRef.current = now;

      player.seekTo(target, true);

      const formattedTarget = formatTime(target);
      const formattedDur = dur > 0 ? formatTime(dur) : "--:--";
      setStatusText(`${icon} SEEK: ${formattedTarget} / ${formattedDur} (${sign}${deltaSeconds}s)`);

      return {
        currentTime: liveCur,
        targetTime: target,
        duration: dur,
        formattedTarget,
        formattedDuration: formattedDur,
        deltaSeconds,
        icon,
        sign,
      };
    } catch (e) {}
    return null;
  }, []);

  // Next / Previous Track Skipper (Skips between YouTube playlist tracks)
  const handleSkipTrack = useCallback((direction) => {
    const player = ytPlayerRef.current;
    if (player && isYtReadyRef.current) {
      try {
        if (direction > 0 && typeof player.nextVideo === "function") {
          player.nextVideo();
          setStatusText("⏩ NEXT PLAYLIST TRACK");
        } else if (direction < 0 && typeof player.previousVideo === "function") {
          player.previousVideo();
          setStatusText("⏪ PREVIOUS PLAYLIST TRACK");
        }
      } catch (e) {}
    }
  }, []);

  // Physical On-Model Button Actions
  const handleButtonAction = useCallback(
    async (btnId) => {
      if (clickRef.current) {
        clickRef.current.currentTime = 0;
        clickRef.current.volume = 0.8;
        clickRef.current.play().catch(() => {});
      }

      if (!started) {
        await setupAudio();
      }

      const playlist = currentPlaylist;
      const player = ytPlayerRef.current;
      const isReady = isYtReadyRef.current && player && typeof player.playVideo === "function";

      if (btnId === "play" || btnId === "power") {
        if (isPlayingRef.current) {
          if (isReady) {
            try {
              player.pauseVideo();
            } catch (e) {}
          }
          setIsPlaying(false);
          setStatusText("PAUSED / POWER STANDBY");
        } else {
          if (isReady) {
            const state = typeof player.getPlayerState === "function" ? player.getPlayerState() : -1;
            if (state === -1 || state === 5 || state === 0) {
              try {
                player.loadPlaylist({
                  list: playlist.playlistId,
                  listType: "playlist",
                  index: 0,
                  startSeconds: 0,
                });
                player.playVideo();
              } catch (e) {
                player.playVideo();
              }
            } else {
              player.playVideo();
            }
          } else {
            pendingAutoplayRef.current = true;
          }
          setIsPlaying(true);
          setStatusText(`NOW PLAYING: ${playlist.name}`);
        }
      } else if (btnId === "pause") {
        if (isPlayingRef.current) {
          if (isReady) {
            try {
              player.pauseVideo();
            } catch (e) {}
          }
          setIsPlaying(false);
          setStatusText("PAUSED");
        } else {
          if (isReady) {
            try {
              player.playVideo();
            } catch (e) {}
          }
          setIsPlaying(true);
          setStatusText(`RESUMED: ${playlist.name}`);
        }
      } else if (btnId === "mute") {
        const nextMuted = !isMutedRef.current;
        setIsMuted(nextMuted);
        if (isReady) {
          try {
            nextMuted ? player.mute() : player.unMute();
          } catch (e) {}
        }
        setStatusText(nextMuted ? "MUTED [AUDIO OFF]" : "UNMUTED [AUDIO ON]");
      } else if (btnId === "stereo") {
        setBassBoost((prev) => {
          const next = prev === 0 ? 8 : 0;
          setStatusText(
            next > 0 ? "STEREO BASS BOOST: [ON +8dB]" : "STEREO BASS BOOST: [OFF 0dB]"
          );
          return next;
        });
      } else if (btnId === "stop") {
        if (isReady) {
          try {
            player.stopVideo();
          } catch (e) {}
        }
        setIsPlaying(false);
        setStatusText("STOPPED / RESET");
      } else if (btnId === "rewind") {
        if (isReady) {
          try {
            player.seekTo(0, true);
          } catch (e) {}
        }
        setStatusText("REWOUND TAPE TO START (00:00)");
      } else if (btnId === "next") {
        handleSkipTrack(1);
      } else if (btnId === "prev") {
        handleSkipTrack(-1);
      }
    },
    [started, handleSkipTrack]
  );

  return (
    <main className="boombox-viewport">
      {/* 2-Second Retro Tuning Loader Overlay */}
      <TuningLoader isLoading={isLoading} currentPlaylist={currentPlaylist} />

      {/* Neon Oscilloscope Audio Waveform Visualizer */}
      <NeonSoundwaveVisualizer
        isPlaying={isPlaying}
        audioDataRef={audioDataRef}
        volume={volume}
        freqDataRef={freqDataRef}
        timeDataRef={timeDataRef}
      />

      {/* 3D Canvas */}
      <div className="canvas-container">
        <Scene
          audioDataRef={audioDataRef}
          active={isPlaying}
          volume={volume}
          setVolume={setVolume}
          tuning={tuning}
          setTuning={setTuning}
          bassBoost={bassBoost}
          setBassBoost={setBassBoost}
          isMuted={isMuted}
          onButtonAction={handleButtonAction}
          onSeek={handleSeek}
          trackProgress={trackProgress}
          currentTrack={currentPlaylist}
        />
      </div>

      {/* Film Grain */}
      <div className="film-grain" aria-hidden="true" />

      {/* Top Header */}
      <TopHeader
        isPlaying={isPlaying}
        freqBars={freqBars}
      />

      {/* Bottom Interactive Cassette Deck */}
      <ControlDeck
        isPlaying={isPlaying}
        isMuted={isMuted}
        bassBoost={bassBoost}
        handleButtonAction={handleButtonAction}
      />

      {/* Background YouTube Player Container with clean mount point */}
      <div id="yt-boombox-container" className="yt-audio-container" aria-hidden="true">
        <div id="yt-boombox-player" />
      </div>

      {/* Audio Click Tag */}
      <audio ref={clickRef} src="/audio/cassette-click.mp3" preload="auto" />
    </main>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  if (!window.__nostalgia_root) {
    window.__nostalgia_root = createRoot(rootEl);
  }
  window.__nostalgia_root.render(<App />);
}
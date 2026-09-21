// Direct Curated YouTube Playlists Configuration
export const RADIO_PLAYLISTS = {
  love: {
    id: "love",
    name: "❤️ 90s Bollywood Love Classics",
    shortTitle: "90s ROMANCE",
    icon: "❤️",
    label: "Love: 90s Romantic Playlist",
    type: "youtube",
    tuning: 94.6,
    playlistId: "PLSneFZm2_2hiyy8lDLB6TRXQxu-CJGgSG",
  },
};

// Physical Controls Configuration (Invisible raycast colliders matching exact 3D model vertices)
export const CASSETTE_BUTTONS = [
  // 3 Bottom-Left Mode/Power Switches
  { id: "power", label: "POWER", icon: "⚡", symbol: "⏻", desc: "Power Standby / On", x: -0.0325, y: 0.0299, z: 0.118, type: "toggle", group: "mode", ledColor: "#00ff88" },
  { id: "mute", label: "MUTE", icon: "🔇", symbol: "MUTE", desc: "Mute / Unmute Audio", x: -0.0195, y: 0.0299, z: 0.118, type: "toggle", group: "mode", ledColor: "#ff4433" },
  { id: "stereo", label: "BASS BOOST", icon: "💥", symbol: "+8dB", desc: "Toggle Stereo Bass Boost", x: -0.0065, y: 0.0299, z: 0.118, type: "toggle", group: "mode", ledColor: "#ffaa00" },

  // 6 Piano-Key Cassette Deck Controls
  { id: "prev", label: "PREV", icon: "⏮", symbol: "◀◀", desc: "Previous Song in Playlist", x: 0.0325, y: 0.0299, z: 0.118, type: "key", group: "deck", ledColor: "#ff8800" },
  { id: "play", label: "PLAY", icon: "▶", symbol: "▶", desc: "Play / Resume Radio", x: 0.0545, y: 0.0299, z: 0.118, type: "key", group: "deck", ledColor: "#00ff88" },
  { id: "rewind", label: "REWIND", icon: "⏪", symbol: "◀◀", desc: "Rewind to Start (00:00)", x: 0.0765, y: 0.0299, z: 0.118, type: "key", group: "deck", ledColor: "#ffaa00" },
  { id: "next", label: "NEXT", icon: "⏭", symbol: "▶▶", desc: "Fast Forward / Next Song", x: 0.0985, y: 0.0299, z: 0.118, type: "key", group: "deck", ledColor: "#00ddff" },
  { id: "stop", label: "STOP", icon: "⏹", symbol: "■", desc: "Stop Audio / Reset", x: 0.1205, y: 0.0299, z: 0.118, type: "key", group: "deck", ledColor: "#ff4433" },
  { id: "pause", label: "PAUSE", icon: "⏸", symbol: "❚❚", desc: "Pause Current Stream", x: 0.1431, y: 0.0299, z: 0.118, type: "key", group: "deck", ledColor: "#ffaa00" },
];

// Active Station Configuration
export function getInitialStation() {
  return "love";
}

export function getStationUrl() {
  return "/nostalgia-radio/";
}

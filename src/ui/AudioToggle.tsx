import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useUniverse } from '../store/useUniverse';
import { pauseSpaceAudio, resumeSpaceAudio } from '../audio/spaceAudio';

/**
 * Sound control — a small equalizer that lives in the bottom-right corner.
 * The bars dance while the ambience plays and freeze when muted.
 */
export default function AudioToggle() {
  const ready = useUniverse((s) => s.ready);
  const audioOn = useUniverse((s) => s.audioOn);
  const setAudioOn = useUniverse((s) => s.setAudioOn);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ready || !ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1.2, delay: 1.6, ease: 'power3.out' },
    );
  }, [ready]);

  if (!ready) return null;

  const toggle = () => {
    if (audioOn) {
      pauseSpaceAudio();
      setAudioOn(false);
    } else {
      resumeSpaceAudio();
      setAudioOn(true);
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      className="audio-toggle pointer-events-auto"
      aria-label={audioOn ? 'Mute space ambience' : 'Play space ambience'}
      aria-pressed={audioOn}
      data-on={audioOn}
    >
      <span className="audio-toggle__bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}

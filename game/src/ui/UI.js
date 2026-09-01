/**
 * UI — Spacecraft HUD, Telemetry, Scanner Cards, Mission Tracker,
 * Radar, Sector Map, and Equipment Upgrade Terminal.
 */
import gsap from 'gsap';
import { formatTime } from '../utils/math.js';
import { Radar } from './Radar.js';
import { SectorMap } from './SectorMap.js';

export class UI {
  constructor(root) {
    this.root = root;
    root.innerHTML = /* html */ `
      <div class="vignette"></div>

      <a href="/" class="back-link glass" data-el="back">Portfolio</a>

      <!-- Start Screen -->
      <section class="screen screen--start" data-el="start">
        <h1 class="title">DEEPSPACE</h1>
        <div class="subtitle">Cinematic Deep-Space Exploration & Survival</div>
        <div class="rule"></div>
        <button class="prompt glass" data-el="begin">Press <span class="key">Enter</span> to Launch</button>
        <div class="controls-hint">
          <span><b>WASD</b> 3D Flight</span><span><b>Space</b> Ascend</span><span><b>X / Ctrl</b> Descend</span>
          <span><b>Shift</b> Turbo Boost</span><span><b>B</b> Brake</span><span><b>E</b> Interact / Collect</span>
          <span><b>Q</b> Sonar Scanner</span><span><b>M</b> Sector Map</span><span><b>U</b> Upgrades</span>
        </div>
        <div class="foot">
          <button class="foot__fullscreen" data-el="fullscreen">Fullscreen ⛶</button>
        </div>
      </section>

      <!-- Atmospheric Spacecraft HUD -->
      <div class="hud" data-el="hud" style="visibility:hidden">
        <!-- Top Left: Survival Stats -->
        <div class="hud__stats">
          <div class="stat-row">
            <span class="label">SUIT INTEGRITY</span>
            <span class="value" data-el="suitVal">100%</span>
            <span class="hud__bar hud__bar--suit"><i data-el="suitBar"></i></span>
          </div>
          <div class="stat-row">
            <span class="label">OXYGEN</span>
            <span class="value" data-el="oxygenVal">100%</span>
            <span class="hud__bar hud__bar--oxygen"><i data-el="oxygenBar"></i></span>
          </div>
          <div class="stat-row">
            <span class="label">JETPACK FUEL</span>
            <span class="value" data-el="fuelVal">100%</span>
            <span class="hud__bar hud__bar--fuel"><i data-el="fuelBar"></i></span>
          </div>
          <div class="stat-row">
            <span class="label">MISSION TIME</span>
            <span class="value time-val" data-el="timer">00:00.00</span>
          </div>
        </div>

        <!-- Top Center: Coordinates & Hazard Banner -->
        <div class="hud__coords">
          <span class="label">COSMIC COORDINATES</span>
          <span class="value" data-el="coordsVal">X: 0 Y: 0 Z: 0</span>
          <span class="sub" data-el="altVal">ALTITUDE 3m</span>
          <div class="hud__hazard glass" data-el="hazardBanner" style="display:none">
            <span class="icon">⚠</span>
            <span data-el="hazardText">ALERT</span>
          </div>
        </div>

        <!-- Top Right: Astronaut Level, Credits & Sector -->
        <div class="hud__level">
          <div class="level-header">
            <span class="label" data-el="levelLabel">ASTRONAUT LVL 01</span>
            <span class="credits" data-el="creditsVal">CR 300</span>
          </div>
          <span class="hud__bar hud__bar--xp"><i data-el="xpBar"></i></span>
          <span class="name" data-el="sectorName">SECTOR 01 — ORBITAL RUINS</span>
          <div class="hud__relics">
            <span class="relic-label">RELICS</span>
            <span class="num" data-el="relicsVal">0</span>
          </div>
        </div>

        <!-- Mission Objective Tracker (Center Left) -->
        <div class="hud__mission glass" data-el="missionBox">
          <div class="mission-header">
            <span class="icon">◈</span>
            <span class="m-title" data-el="missionTitle">MISSION 01: LOST SIGNAL</span>
          </div>
          <div class="mission-objective" data-el="missionObjective">Navigate to Signal Coordinates</div>
          <div class="mission-dist" data-el="missionDist">DISTANCE: --m</div>
        </div>

        <!-- Scanner Card HUD Overlay (Center Right) -->
        <div class="hud__scancard glass" data-el="scanCard" style="display:none">
          <div class="scancard-title" data-el="scanTitle">SIGNAL ACQUIRED</div>
          <div class="scancard-row"><span>NAME</span><b data-el="scanName">Research Fragment</b></div>
          <div class="scancard-row"><span>DISTANCE</span><b data-el="scanDist">124m</b></div>
          <div class="scancard-row"><span>BEARING</span><b data-el="scanBearing">074°</b></div>
          <div class="scancard-row"><span>SIGNAL</span><b data-el="scanStrength">85%</b></div>
        </div>

        <!-- Contextual E Interaction Prompt -->
        <div class="hud__interact glass" data-el="interactPrompt" style="display:none">
          <span class="key-badge">E</span>
          <span class="text" data-el="interactText">INTERACT</span>
        </div>

        <!-- Beacon / Status text -->
        <div class="hud__beacon" data-el="beaconBox">
          <span class="icon">⟐</span>
          <span data-el="beaconText">Scanning orbit...</span>
        </div>

        <!-- Speedometer & Radar Instrumentation (Bottom Right) -->
        <div class="hud__instrumentation">
          <div class="hud__speed">
            <span class="ring" data-el="speedRing"></span>
            <div class="readout">
              <span class="kmh" data-el="speedVal">0</span>
              <span class="unit">km/h</span>
            </div>
          </div>
          <div class="radar-container" data-el="radarRoot"></div>
        </div>

        <!-- Control Action Chips (Bottom Left) -->
        <div class="hud__keys">
          <span class="key-chip"><b>SPACE</b> ASCEND</span>
          <span class="key-chip"><b>X</b> DESCEND</span>
          <span class="key-chip"><b>F / SHIFT</b> LIGHT SPEED</span>
          <span class="key-chip"><b>B</b> BRAKE</span>
          <span class="key-chip"><b>E</b> INTERACT</span>
          <span class="key-chip"><b>Q</b> SCAN</span>
          <span class="key-chip"><b>M</b> MAP</span>
          <span class="key-chip"><b>U</b> UPGRADES</span>
        </div>

        <div class="hud__toast glass" data-el="toast"></div>
      </div>

      <!-- Equipment Upgrades Terminal -->
      <section class="screen screen--overlay" data-el="upgradesScreen" style="display:none">
        <div class="panel glass panel--upgrades" style="position:relative">
          <button class="modal-close-btn" data-el="closeUpgradesX" title="Close Terminal">✕</button>
          <div class="panel__title">EQUIPMENT UPGRADE TERMINAL</div>
          <div class="kicker" data-el="upgradeCredits">CREDITS: CR 300</div>
          
          <div class="upgrades-grid">
            <div class="upgrade-card" data-upgrade="jetpackSpeed">
              <div class="u-title">Jetpack Max Speed</div>
              <div class="u-desc">+10% Thruster Velocity per Tier</div>
              <div class="u-tier" data-el="tier_jetpackSpeed">TIER 1/5</div>
              <button class="btn btn--buy" data-el="buy_jetpackSpeed">Upgrade (CR 250)</button>
            </div>
            <div class="upgrade-card" data-upgrade="fuelCapacity">
              <div class="u-title">Fuel Tank Capacity</div>
              <div class="u-desc">+20% Max Jetpack Fuel Reserves</div>
              <div class="u-tier" data-el="tier_fuelCapacity">TIER 1/5</div>
              <button class="btn btn--buy" data-el="buy_fuelCapacity">Upgrade (CR 200)</button>
            </div>
            <div class="upgrade-card" data-upgrade="boostEfficiency">
              <div class="u-title">Boost Efficiency</div>
              <div class="u-desc">-15% Fuel Burn while Warping</div>
              <div class="u-tier" data-el="tier_boostEfficiency">TIER 1/5</div>
              <button class="btn btn--buy" data-el="buy_boostEfficiency">Upgrade (CR 300)</button>
            </div>
            <div class="upgrade-card" data-upgrade="suitArmor">
              <div class="u-title">Suit Nanoweave Armor</div>
              <div class="u-desc">-20% Damage from Space Debris</div>
              <div class="u-tier" data-el="tier_suitArmor">TIER 1/5</div>
              <button class="btn btn--buy" data-el="buy_suitArmor">Upgrade (CR 350)</button>
            </div>
            <div class="upgrade-card" data-upgrade="oxygenReserves">
              <div class="u-title">Life Support O2 Tank</div>
              <div class="u-desc">+25% Oxygen Storage Duration</div>
              <div class="u-tier" data-el="tier_oxygenReserves">TIER 1/5</div>
              <button class="btn btn--buy" data-el="buy_oxygenReserves">Upgrade (CR 200)</button>
            </div>
            <div class="upgrade-card" data-upgrade="scannerRange">
              <div class="u-title">Holo-Sonar Array</div>
              <div class="u-desc">+30m Sonar Ping Detection Radius</div>
              <div class="u-tier" data-el="tier_scannerRange">TIER 1/5</div>
              <button class="btn btn--buy" data-el="buy_scannerRange">Upgrade (CR 400)</button>
            </div>
          </div>

          <button class="btn btn--primary" data-el="closeUpgrades" style="margin-top:20px">Close Terminal (Esc)</button>
        </div>
      </section>

      <!-- Pause Menu -->
      <section class="screen screen--overlay" data-el="pause" style="display:none">
        <div class="panel glass">
          <div class="kicker" data-el="pauseMeta">Sector 01 · 00:00</div>
          <div class="panel__title">PAUSED</div>
          <div class="menu">
            <button class="is-primary" data-el="resume">Resume Flight</button>
            <button data-el="openUpgrades">Equipment Upgrades (U)</button>
            <button data-el="restartLevel">Restart Sector</button>
            <button data-el="settingsAudio">Audio — On</button>
            <button data-el="mainMenu">Main Menu</button>
          </div>
          <div class="esc-hint">Press <span class="key">Esc</span> to resume</div>
        </div>
      </section>

      <!-- Level Complete / Sector Clear -->
      <section class="screen screen--overlay" data-el="complete" style="display:none">
        <div class="panel glass">
          <div class="kicker" data-el="completeKicker">MISSION COMPLETE</div>
          <div class="panel__title" data-el="completeMissionTitle">LOST SIGNAL</div>
          <div class="panel__rows">
            <div class="row"><span class="k">Experience</span><span class="v" data-el="completeXP">+450 XP</span></div>
            <div class="row"><span class="k">Credits Earned</span><span class="v" data-el="completeCredits">+1,200 CR</span></div>
            <div class="row"><span class="k">Mission Time</span><span class="v" data-el="completeTime">04:12</span></div>
          </div>
          <button class="btn btn--primary" data-el="continue">Continue →</button>
        </div>
      </section>

      <!-- Game Over Modal -->
      <section class="screen screen--overlay" data-el="gameover" style="display:none">
        <div class="panel glass">
          <div class="kicker" style="color:#ff3344">CRITICAL FAILURE</div>
          <div class="panel__title">SUIT INTEGRITY COMPROMISED</div>
          <div class="panel__rows">
            <div class="row"><span class="k">Status</span><span class="v">Astronaut Lost in Deep Space</span></div>
          </div>
          <button class="btn btn--primary" data-el="respawnBtn">Respawn at Beacon</button>
        </div>
      </section>

      <div class="bar bar--top"></div>
      <div class="bar bar--bottom"></div>
      <div class="veil" data-el="veil"></div>
    `;

    this.el = {};
    for (const node of root.querySelectorAll('[data-el]')) {
      this.el[node.dataset.el] = node;
    }
    this.bars = root.querySelectorAll('.bar');

    // Sub-components
    this.radar = new Radar(this.el.radarRoot);
    this.sectorMap = new SectorMap(root);

    this.onUpgradeBuy = null;
    this._wireUpgradeButtons();
  }

  _wireUpgradeButtons() {
    const keys = ['jetpackSpeed', 'fuelCapacity', 'boostEfficiency', 'suitArmor', 'oxygenReserves', 'scannerRange'];
    keys.forEach((k) => {
      const btn = this.el[`buy_${k}`];
      btn?.addEventListener('click', () => {
        this.onUpgradeBuy?.(k);
      });
    });
  }

  showStart() {
    this.el.start.style.display = 'flex';
    this.hideHUD();
    this.el.pause.style.display = 'none';
    this.el.complete.style.display = 'none';
    this.el.gameover.style.display = 'none';
    this.el.upgradesScreen.style.display = 'none';
    this.sectorMap.hide();
  }

  hideStart() {
    gsap.to(this.el.start, {
      autoAlpha: 0,
      duration: 0.4,
      onComplete: () => {
        this.el.start.style.display = 'none';
        this.el.start.style.opacity = '1';
        this.el.start.style.visibility = 'visible';
      },
    });
  }

  showHUD() {
    this.el.hud.style.visibility = 'visible';
    this.el.hud.style.display = 'block';
  }

  hideHUD() {
    this.el.hud.style.visibility = 'hidden';
    this.el.hud.style.display = 'none';
  }

  setSurvivalStats({ suitIntegrity, health, oxygen, fuel } = {}) {
    const suit = Number.isFinite(suitIntegrity) ? suitIntegrity : (Number.isFinite(health) ? health : 100);
    const oxy = Number.isFinite(oxygen) ? oxygen : 100;
    const fl = Number.isFinite(fuel) ? fuel : 100;

    this.el.suitVal.textContent = `${Math.round(suit)}%`;
    this.el.suitBar.style.width = `${Math.max(0, suit)}%`;

    this.el.oxygenVal.textContent = `${Math.round(oxy)}%`;
    this.el.oxygenBar.style.width = `${Math.max(0, oxy)}%`;

    this.el.fuelVal.textContent = `${Math.round(fl)}%`;
    this.el.fuelBar.style.width = `${Math.max(0, fl)}%`;

    // Visual warning classes
    if (oxy < 25) this.el.oxygenVal.classList.add('stat--crit');
    else this.el.oxygenVal.classList.remove('stat--crit');

    if (fl < 20) this.el.fuelVal.classList.add('stat--crit');
    else this.el.fuelVal.classList.remove('stat--crit');
  }

  setProgression({ level, xp, nextLevelXP, credits, relicsFound }) {
    this.el.levelLabel.textContent = `ASTRONAUT LVL ${String(level).padStart(2, '0')}`;
    this.el.creditsVal.textContent = `CR ${credits.toLocaleString()}`;
    const xpPct = Math.min(100, Math.max(0, (xp / nextLevelXP) * 100));
    this.el.xpBar.style.width = `${xpPct}%`;
    this.el.relicsVal.textContent = String(relicsFound);
  }

  setMission(missionSystem) {
    if (!missionSystem) return;
    const data = typeof missionSystem.getCurrentMissionData === 'function'
      ? missionSystem.getCurrentMissionData()
      : {
          title: missionSystem.title ?? 'MISSION 01: LOST SIGNAL',
          objective: typeof missionSystem.getObjectiveText === 'function' ? missionSystem.getObjectiveText() : 'Navigate to Signal Coordinates',
          distance: missionSystem.currentDistance ?? null,
        };
    this.el.missionTitle.textContent = data.title;
    this.el.missionObjective.textContent = data.objective;
    if (data.distance !== null && Number.isFinite(data.distance)) {
      this.el.missionDist.textContent = `DISTANCE: ${Math.round(data.distance)}m`;
    } else {
      this.el.missionDist.textContent = 'STATUS: ACTIVE';
    }
  }

  showScanCard(result) {
    if (!result) {
      gsap.to(this.el.scanCard, { autoAlpha: 0, duration: 0.3, onComplete: () => { this.el.scanCard.style.display = 'none'; } });
      return;
    }
    this.el.scanCard.style.display = 'block';
    this.el.scanTitle.textContent = result.type ?? 'OBJECT DETECTED';
    this.el.scanName.textContent = result.name ?? 'Unknown';
    this.el.scanDist.textContent = `${result.distance}m`;
    this.el.scanBearing.textContent = result.bearing;
    this.el.scanStrength.textContent = result.strength;

    gsap.fromTo(this.el.scanCard, { autoAlpha: 0, x: 20 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power2.out' });
  }

  setHazardAlert(active, message = '') {
    if (active) {
      this.el.hazardBanner.style.display = 'flex';
      this.el.hazardBanner.style.borderColor = '';
      this.el.hazardBanner.style.background = '';
      this.el.hazardText.textContent = message;
    } else {
      this.el.hazardBanner.style.display = 'none';
    }
  }

  setProximityAlert(warning) {
    if (!warning) {
      if (this.el.hazardBanner.dataset.isProximity === 'true') {
        this.el.hazardBanner.style.display = 'none';
        this.el.hazardBanner.dataset.isProximity = 'false';
      }
      return;
    }
    this.el.hazardBanner.style.display = 'flex';
    this.el.hazardBanner.dataset.isProximity = 'true';
    if (warning.threatLevel === 'CRITICAL') {
      this.el.hazardBanner.style.borderColor = '#ff3344';
      this.el.hazardBanner.style.background = 'rgba(255, 30, 50, 0.28)';
      this.el.hazardText.textContent = `⚠ COLLISION WARNING: ${warning.name.toUpperCase()} (${warning.distance}M)`;
    } else {
      this.el.hazardBanner.style.borderColor = '#ffaa33';
      this.el.hazardBanner.style.background = 'rgba(255, 170, 50, 0.18)';
      this.el.hazardText.textContent = `⚠ PROXIMITY ALERT: ${warning.name} (${warning.distance}m)`;
    }
  }

  setInteractPrompt(text) {
    if (!this.el.interactPrompt) return;
    if (!text) {
      this.el.interactPrompt.style.display = 'none';
    } else {
      this.el.interactPrompt.style.display = 'flex';
      this.el.interactText.textContent = text;
    }
  }

  setSpeed(kmh, isWarp = false) {
    const skmh = Number.isFinite(kmh) ? kmh : 0;
    if (isWarp || skmh > 180) {
      const warpFactor = Math.min(9.9, Math.max(1.0, skmh / 65)).toFixed(1);
      this.el.speedVal.textContent = `WARP ${warpFactor}`;
      this.el.speedRing.style.setProperty('--deg', '280deg');
    } else {
      this.el.speedVal.textContent = String(Math.round(skmh));
      const pct = Math.min(1, skmh / 120);
      this.el.speedRing.style.setProperty('--deg', `${Math.round(pct * 280)}deg`);
    }
  }

  setWarpState(isWarp, intensity = 0) {
    if (isWarp || intensity > 0.05) {
      this.el.hud.classList.add('hud--warp');
    } else {
      this.el.hud.classList.remove('hud--warp');
    }
  }

  setCoords(x, y, z, alt) {
    const cx = Number.isFinite(x) ? Math.round(x) : 0;
    const cy = Number.isFinite(y) ? Math.round(y) : 0;
    const cz = Number.isFinite(z) ? Math.round(z) : 0;
    const calt = Number.isFinite(alt) ? Math.max(0, Math.round(alt)) : 0;
    this.el.coordsVal.textContent = `X:${cx} Y:${cy} Z:${cz}`;
    this.el.altVal.textContent = `ALTITUDE ${calt}m`;
  }

  setTimer(sec) {
    this.el.timer.textContent = formatTime(sec);
  }

  setBeacon(name) {
    this.el.beaconText.textContent = name;
  }

  updateRadar(playerPos, playerYaw, targets) {
    this.radar.render(playerPos, playerYaw, targets);
  }

  updateSectorMap(playerPos, playerYaw, targets) {
    if (this.sectorMap.visible) {
      this.sectorMap.render(playerPos, playerYaw, targets);
    }
  }

  get isUpgradesOpen() {
    return this.el.upgradesScreen?.style.display === 'flex' || this.el.upgradesScreen?.style.display === 'block';
  }

  get isPauseOpen() {
    return this.el.pause?.style.display === 'flex' || this.el.pause?.style.display === 'block';
  }

  showUpgrades(progression) {
    this.el.pause.style.display = 'none';
    this.sectorMap.hide();
    this.updateUpgradeTerminal(progression);
    this.el.upgradesScreen.style.display = 'flex';
    gsap.fromTo(
      this.el.upgradesScreen.querySelector('.panel'),
      { autoAlpha: 0, scale: 0.92, y: 20 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.35, ease: 'power2.out' },
    );
  }

  hideUpgrades() {
    this.el.upgradesScreen.style.display = 'none';
  }

  updateUpgradeTerminal(progression) {
    this.el.upgradeCredits.textContent = `CREDITS: CR ${progression.credits.toLocaleString()}`;
    const keys = ['jetpackSpeed', 'fuelCapacity', 'boostEfficiency', 'suitArmor', 'oxygenReserves', 'scannerRange'];
    keys.forEach((k) => {
      const tierEl = this.el[`tier_${k}`];
      const buyEl = this.el[`buy_${k}`];
      const tier = progression.upgrades[k] ?? 1;
      const cost = progression.getUpgradeCost(k);
      const isMax = tier >= 5;

      if (tierEl) tierEl.textContent = isMax ? 'MAX TIER (5/5)' : `TIER ${tier}/5`;
      if (buyEl) {
        if (isMax) {
          buyEl.textContent = 'MAXED';
          buyEl.disabled = true;
        } else {
          buyEl.textContent = `Upgrade (CR ${cost})`;
          buyEl.disabled = progression.credits < cost;
        }
      }
    });
  }

  showPause(meta) {
    this.el.upgradesScreen.style.display = 'none';
    this.sectorMap.hide();
    this.el.pauseMeta.textContent = meta;
    this.el.pause.style.display = 'flex';
    this.hideHUD();
    gsap.fromTo(
      this.el.pause.querySelector('.panel'),
      { autoAlpha: 0, scale: 0.95 },
      { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
    );
  }

  hidePause() {
    this.el.pause.style.display = 'none';
    this.showHUD();
  }

  showGameOver(onRespawn = null) {
    this.hideHUD();
    this.el.gameover.style.display = 'flex';
    this._onRespawnCallback = onRespawn;
    gsap.fromTo(
      this.el.gameover.querySelector('.panel'),
      { autoAlpha: 0, scale: 0.95 },
      { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
    );
  }

  hideGameOver() {
    this.el.gameover.style.display = 'none';
    this.showHUD();
  }

  showComplete(data, onContinue) {
    this.hideHUD();
    this.el.complete.style.display = 'flex';
    this.el.completeMissionTitle.textContent = data.title ?? 'MISSION CLEAR';
    this.el.completeXP.textContent = `+${data.xp ?? 0} XP`;
    this.el.completeCredits.textContent = `+${data.credits?.toLocaleString() ?? 0} CR`;
    this.el.completeTime.textContent = formatTime(data.time ?? 0);

    const handler = () => {
      this.el.continue.removeEventListener('click', handler);
      this.el.complete.style.display = 'none';
      onContinue?.();
    };
    this.el.continue.addEventListener('click', handler);

    gsap.fromTo(
      this.el.complete.querySelector('.panel'),
      { autoAlpha: 0, scale: 0.95 },
      { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power2.out' },
    );
  }

  hideComplete() {
    this.el.complete.style.display = 'none';
  }

  toast(text, hold = 1.8) {
    const t = this.el.toast;
    t.textContent = text;
    gsap.timeline()
      .fromTo(t, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'expo.out' })
      .to(t, { autoAlpha: 0, y: -10, duration: 0.4, ease: 'power2.in' }, `+=${hold}`);
  }
}

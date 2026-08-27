/**
 * Progression — Player level, XP, credits, equipment upgrades,
 * and localStorage persistence.
 */
const SAVE_KEY = 'deepspace_progression_v2';

export class Progression {
  constructor() {
    this.level = 1;
    this.xp = 0;
    this.xpRequired = 500;
    this.credits = 300;
    this.completedMissions = 0;
    this.discoveredSectors = 1;
    this.discoveredAnomalies = 0;
    this.relicsFound = 0;

    this.upgrades = {
      jetpackSpeed: 1,      // +10% speed per tier
      fuelCapacity: 1,      // +20% fuel per tier
      boostEfficiency: 1,   // -15% fuel drain per tier
      suitArmor: 1,         // +20% health per tier
      oxygenReserves: 1,    // +25% oxygen duration
      scannerRange: 1,      // +25m scan range
    };

    this.load();
  }

  addXP(amount, onLevelUp = null) {
    this.xp += amount;
    let leveledUp = false;

    while (this.xp >= this.xpRequired) {
      this.xp -= this.xpRequired;
      this.level += 1;
      this.xpRequired = Math.round(this.xpRequired * 1.35);
      this.credits += this.level * 250;
      leveledUp = true;
    }

    this.save();
    if (leveledUp) {
      onLevelUp?.(this.level, this.credits);
    }
  }

  addCredits(amount) {
    this.credits += amount;
    this.save();
  }

  getUpgradeCost(upgradeKey) {
    const tier = this.upgrades[upgradeKey] ?? 1;
    if (tier >= 5) return null; // Max tier
    return tier * 250;
  }

  buyUpgrade(upgradeKey, playerStats = null) {
    return this.purchaseUpgrade(upgradeKey, () => {
      if (playerStats) this.applyUpgrades(playerStats);
    });
  }

  purchaseUpgrade(upgradeKey, onComplete = null) {
    const cost = this.getUpgradeCost(upgradeKey);
    if (!cost || this.credits < cost) return false;

    this.credits -= cost;
    this.upgrades[upgradeKey] = (this.upgrades[upgradeKey] ?? 1) + 1;
    this.save();
    onComplete?.(this.upgrades[upgradeKey], this.credits);
    return true;
  }

  applyUpgrades(playerStats) {
    if (!playerStats) return;

    // Fuel capacity tier
    playerStats.maxFuel = 100 + (this.upgrades.fuelCapacity - 1) * 20;
    playerStats.fuel = Math.min(playerStats.fuel, playerStats.maxFuel);

    // Suit Armor tier
    playerStats.maxHealth = 100 + (this.upgrades.suitArmor - 1) * 20;
    playerStats.health = Math.min(playerStats.health, playerStats.maxHealth);

    // Oxygen tier
    playerStats.maxOxygen = 100 + (this.upgrades.oxygenReserves - 1) * 25;
    playerStats.oxygen = Math.min(playerStats.oxygen, playerStats.maxOxygen);
  }

  save() {
    try {
      const data = {
        level: this.level,
        xp: this.xp,
        xpRequired: this.xpRequired,
        credits: this.credits,
        completedMissions: this.completedMissions,
        discoveredSectors: this.discoveredSectors,
        discoveredAnomalies: this.discoveredAnomalies,
        relicsFound: this.relicsFound,
        upgrades: this.upgrades,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      // Storage unavailable / private mode
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.level) this.level = data.level;
      if (data.xp !== undefined) this.xp = data.xp;
      if (data.xpRequired) this.xpRequired = data.xpRequired;
      if (data.credits !== undefined) this.credits = data.credits;
      if (data.completedMissions) this.completedMissions = data.completedMissions;
      if (data.discoveredSectors) this.discoveredSectors = data.discoveredSectors;
      if (data.discoveredAnomalies) this.discoveredAnomalies = data.discoveredAnomalies;
      if (data.relicsFound) this.relicsFound = data.relicsFound;
      if (data.upgrades) this.upgrades = { ...this.upgrades, ...data.upgrades };
    } catch (e) {
      // Storage parsing failure fallback
    }
  }
}

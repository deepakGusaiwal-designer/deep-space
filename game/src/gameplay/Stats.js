/**
 * Stats — Player survival metrics:
 *  - Suit Integrity (Health): 0–100%
 *  - Oxygen Supply: 0–100%
 *  - Jetpack Fuel: 0–100%
 *  - Shield / Energy: 0–100%
 */
import { clamp } from '../utils/math.js';

export class PlayerStats {
  constructor() {
    this.maxHealth = 100;
    this.health = 100;

    this.maxOxygen = 100;
    this.oxygen = 100;

    this.maxFuel = 100;
    this.fuel = 100;

    this.maxEnergy = 100;
    this.energy = 100;

    this.isDead = false;
    this.isOxygenLow = false;
    this.isJetpackOffline = false;

    // Drain & Recovery rates per second
    this.oxygenDepleteRate = 0.15; // very generous oxygen in deep space
    this.fuelRechargeRate = 80;    // instant recovery to 100% full
    this.shieldRechargeRate = 25;
  }

  get suitIntegrity() {
    return this.health;
  }

  set suitIntegrity(v) {
    this.health = v;
  }

  reset() {
    this.health = this.maxHealth;
    this.oxygen = this.maxOxygen;
    this.fuel = this.maxFuel;
    this.energy = this.maxEnergy;
    this.isDead = false;
    this.isOxygenLow = false;
    this.isJetpackOffline = false;
  }

  damage(amount, source = 'impact') {
    if (this.isDead) return;
    
    // Shield absorbs damage first
    if (this.energy > 0) {
      const absorbed = Math.min(this.energy, amount);
      this.energy -= absorbed;
      amount -= absorbed;
    }

    this.health = clamp(this.health - amount, 0, this.maxHealth);
    if (this.health <= 0) {
      this.isDead = true;
    }
  }

  heal(amount) {
    this.health = clamp(this.health + amount, 0, this.maxHealth);
  }

  consumeFuel(amount) {
    this.fuel = clamp(this.fuel - amount, 0, this.maxFuel);
    this.isJetpackOffline = this.fuel <= 0.5;
    return !this.isJetpackOffline;
  }

  consumeEnergy(amount) {
    if (this.energy >= amount) {
      this.energy -= amount;
      return true;
    }
    return false;
  }

  replenishOxygen(amount = 100) {
    this.oxygen = clamp(this.oxygen + amount, 0, this.maxOxygen);
    this.isOxygenLow = this.oxygen < 20;
  }

  replenishFuel(amount = 100) {
    this.fuel = clamp(this.fuel + amount, 0, this.maxFuel);
    this.isJetpackOffline = false;
  }

  replenishAll() {
    this.health = this.maxHealth;
    this.oxygen = this.maxOxygen;
    this.fuel = this.maxFuel;
    this.energy = this.maxEnergy;
    this.isOxygenLow = false;
    this.isJetpackOffline = false;
  }

  update(dt, isFlying, isBoosting) {
    if (this.isDead) return;

    // Oxygen consumption
    this.oxygen = Math.max(0, this.oxygen - this.oxygenDepleteRate * dt);
    this.isOxygenLow = this.oxygen < 15;

    // Oxygen suffocation damage if empty
    if (this.oxygen <= 0) {
      this.damage(8 * dt, 'suffocation');
    }

    // Fuel management: full by default during standard flight, only slight drain on hyperdrive boost
    if (isBoosting) {
      this.consumeFuel(6 * dt);
    } else {
      // Instant recharge back to 100% full
      this.fuel = Math.min(this.maxFuel, this.fuel + this.fuelRechargeRate * dt);
      this.isJetpackOffline = false;
    }

    // Shield auto-recovery
    this.energy = Math.min(this.maxEnergy, this.energy + this.shieldRechargeRate * dt);
  }
}

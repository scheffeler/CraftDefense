import { STARTING_GOLD } from "./config/map";

export class Economy {
  private _gold: number = STARTING_GOLD;
  onChange: (gold: number) => void = () => {};

  get gold(): number { return this._gold; }

  addGold(amount: number): void {
    this._gold += amount;
    this.onChange(this._gold);
  }

  spend(amount: number): boolean {
    if (this._gold < amount) return false;
    this._gold -= amount;
    this.onChange(this._gold);
    return true;
  }

  canAfford(amount: number): boolean {
    return this._gold >= amount;
  }

  reset(): void {
    this._gold = STARTING_GOLD;
    this.onChange(this._gold);
  }
}

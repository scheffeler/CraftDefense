import { ITEMS } from "./config/items";
import type { ArmorSlot } from "./config/items";

export interface ItemStack {
  itemId:        string;
  count:         number;
  durability?:   number;
  enchantments?: string[];  // e.g. ["sharpness_1", "unbreaking_1"]
}

export type SlotArea = "hotbar" | "backpack" | "armor";
export interface SlotRef { area: SlotArea; index: number | ArmorSlot }

const HOTBAR_SIZE  = 9;
const BACKPACK_SIZE = 27;

export class Inventory {
  readonly hotbar:  (ItemStack | null)[] = Array(HOTBAR_SIZE).fill(null);
  readonly backpack: (ItemStack | null)[] = Array(BACKPACK_SIZE).fill(null);
  readonly armor: Record<ArmorSlot, ItemStack | null> = { head: null, chest: null, legs: null, feet: null };

  private _activeSlot = 0;

  get activeSlot(): number { return this._activeSlot; }
  set activeSlot(v: number) { this._activeSlot = Math.max(0, Math.min(8, v)); }

  getActiveItem(): ItemStack | null { return this.hotbar[this._activeSlot]; }

  /**
   * Adds up to `count` of `itemId`. Returns the leftover count that didn't fit.
   */
  addItem(itemId: string, count: number): number {
    const def = ITEMS[itemId];
    if (!def) return count;
    const stackMax = def.stackSize;

    // First fill existing stacks
    for (const slot of [...this.hotbar, ...this.backpack]) {
      if (!slot || slot.itemId !== itemId) continue;
      const space = stackMax - slot.count;
      if (space <= 0) continue;
      const take = Math.min(space, count);
      slot.count += take;
      count -= take;
      if (count === 0) return 0;
    }

    // Then fill empty slots (hotbar first)
    const allSlots = [...this.hotbar, ...this.backpack];
    for (let i = 0; i < allSlots.length; i++) {
      if (allSlots[i] !== null) continue;
      const take = Math.min(stackMax, count);
      const stack: ItemStack = {
        itemId,
        count: take,
        durability: def.durability !== undefined ? def.durability : undefined,
      };
      if (i < HOTBAR_SIZE) this.hotbar[i] = stack;
      else this.backpack[i - HOTBAR_SIZE] = stack;
      count -= take;
      if (count === 0) return 0;
    }

    return count; // leftover
  }

  /**
   * Removes `count` of `itemId`. Returns true if successful.
   */
  removeItem(itemId: string, count: number): boolean {
    if (!this.hasItem(itemId, count)) return false;
    let remaining = count;
    const allSlots = [...this.hotbar, ...this.backpack];
    for (let i = 0; i < allSlots.length && remaining > 0; i++) {
      const slot = allSlots[i];
      if (!slot || slot.itemId !== itemId) continue;
      const take = Math.min(slot.count, remaining);
      slot.count -= take;
      remaining  -= take;
      if (slot.count === 0) {
        if (i < HOTBAR_SIZE) this.hotbar[i] = null;
        else this.backpack[i - HOTBAR_SIZE] = null;
      }
    }
    return true;
  }

  hasItem(itemId: string, count = 1): boolean {
    let total = 0;
    for (const slot of [...this.hotbar, ...this.backpack]) {
      if (slot?.itemId === itemId) total += slot.count;
    }
    return total >= count;
  }

  countItem(itemId: string): number {
    let total = 0;
    for (const slot of [...this.hotbar, ...this.backpack]) {
      if (slot?.itemId === itemId) total += slot.count;
    }
    return total;
  }

  /** Sum of equipped armor armorValue properties, including Protection enchantments. */
  getArmorValue(): number {
    let total = 0;
    for (const slot of Object.values(this.armor)) {
      if (!slot) continue;
      const def = ITEMS[slot.itemId];
      if (def?.armorValue) total += def.armorValue;
      // Protection enchantments add bonus armor
      if (slot.enchantments?.includes("protection_1")) total += 1;
      if (slot.enchantments?.includes("protection_2")) total += 2;
    }
    return total;
  }

  /** Sets a specific hotbar or backpack slot directly (used by crafting). */
  setSlot(area: "hotbar" | "backpack", index: number, stack: ItemStack | null): void {
    if (area === "hotbar") this.hotbar[index] = stack;
    else this.backpack[index] = stack;
  }
}

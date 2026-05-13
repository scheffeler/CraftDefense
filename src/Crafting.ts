import { RECIPES, type Recipe } from "./config/recipes";
import type { Inventory } from "./Inventory";

export class Crafting {
  static normalize(grid: (string | null)[][]): (string | null)[][] {
    const rows = grid.length;
    const cols = rows > 0 ? grid[0].length : 0;

    let minRow = rows, maxRow = -1, minCol = cols, maxCol = -1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== null) {
          if (r < minRow) minRow = r;
          if (r > maxRow) maxRow = r;
          if (c < minCol) minCol = c;
          if (c > maxCol) maxCol = c;
        }
      }
    }

    if (maxRow < 0) return [];

    const result: (string | null)[][] = [];
    for (let r = minRow; r <= maxRow; r++) {
      const row: (string | null)[] = [];
      for (let c = minCol; c <= maxCol; c++) {
        row.push(grid[r][c] ?? null);
      }
      result.push(row);
    }
    return result;
  }

  static findRecipe(grid: (string | null)[][]): Recipe | null {
    const normalized = Crafting.normalize(grid);
    if (normalized.length === 0) return null;

    for (const recipe of RECIPES) {
      if (Crafting.patternsMatch(normalized, recipe.pattern)) return recipe;
    }
    return null;
  }

  private static patternsMatch(
    a: (string | null)[][],
    b: (string | null)[][],
  ): boolean {
    if (a.length !== b.length) return false;
    for (let r = 0; r < a.length; r++) {
      if (a[r].length !== b[r].length) return false;
      for (let c = 0; c < a[r].length; c++) {
        if (a[r][c] !== b[r][c]) return false;
      }
    }
    return true;
  }

  static craft(
    inv: Inventory,
    recipe: Recipe,
  ): { itemId: string; count: number } | null {
    for (const row of recipe.pattern) {
      for (const cell of row) {
        if (cell !== null && !inv.hasItem(cell, 1)) return null;
      }
    }

    const costs: Map<string, number> = new Map();
    for (const row of recipe.pattern) {
      for (const cell of row) {
        if (cell !== null) costs.set(cell, (costs.get(cell) ?? 0) + 1);
      }
    }

    for (const [itemId, count] of costs) {
      if (!inv.removeItem(itemId, count)) return null;
    }

    inv.addItem(recipe.result.itemId, recipe.result.count);
    return { itemId: recipe.result.itemId, count: recipe.result.count };
  }
}

export interface MovementInput {
  forward:  boolean;
  backward: boolean;
  left:     boolean;
  right:    boolean;
  jump:     boolean;
  sprint:   boolean;
}

export class InputManager {
  private readonly keysHeld = new Set<string>();
  private _activeSlot = 0;
  private _leftDown  = false;
  private _rightDown = false;

  onLeftClick:       () => void = () => {};
  onRightClick:      () => void = () => {};
  onRightRelease:    () => void = () => {};
  onInventoryToggle: () => void = () => {};
  onSlotChange:      (slot: number) => void = () => {};

  constructor(canvas: HTMLElement) {
    window.addEventListener("keydown",   e => this.onKeyDown(e));
    window.addEventListener("keyup",     e => this.onKeyUp(e));
    canvas.addEventListener("mousedown", e => this.onMouseDown(e));
    canvas.addEventListener("mouseup",   e => this.onMouseUp(e));
    canvas.addEventListener("wheel",     e => this.onWheel(e), { passive: true });
  }

  get activeSlot(): number { return this._activeSlot; }

  getMovementInput(): MovementInput {
    return {
      forward:  this.keysHeld.has("KeyW")     || this.keysHeld.has("ArrowUp"),
      backward: this.keysHeld.has("KeyS")     || this.keysHeld.has("ArrowDown"),
      left:     this.keysHeld.has("KeyA")     || this.keysHeld.has("ArrowLeft"),
      right:    this.keysHeld.has("KeyD")     || this.keysHeld.has("ArrowRight"),
      jump:     this.keysHeld.has("Space"),
      sprint:   this.keysHeld.has("ShiftLeft") || this.keysHeld.has("ShiftRight"),
    };
  }

  isLeftMouseDown():  boolean { return this._leftDown; }
  isRightMouseDown(): boolean { return this._rightDown; }

  private onKeyDown(e: KeyboardEvent): void {
    this.keysHeld.add(e.code);
    if (e.code === "KeyE") this.onInventoryToggle();

    const digit = e.code.match(/^Digit(\d)$/);
    if (digit) {
      const slot = parseInt(digit[1]) - 1;
      if (slot >= 0 && slot <= 8) {
        this._activeSlot = slot;
        this.onSlotChange(slot);
      }
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keysHeld.delete(e.code);
  }

  private onMouseDown(e: MouseEvent): void {
    if (e.button === 0) { this._leftDown  = true;  this.onLeftClick(); }
    if (e.button === 2) { this._rightDown = true;  this.onRightClick(); }
  }

  private onMouseUp(e: MouseEvent): void {
    if (e.button === 0) this._leftDown  = false;
    if (e.button === 2) { this._rightDown = false; this.onRightRelease(); }
  }

  private onWheel(e: WheelEvent): void {
    const dir = e.deltaY > 0 ? 1 : -1;
    this._activeSlot = (this._activeSlot + dir + 9) % 9;
    this.onSlotChange(this._activeSlot);
  }
}

import { SuElement } from "@core/su-element";
import styles from "./su-divider.css?inline";

export interface DividerMoveDetail {
  name: string;
  position: number;
  delta: number;
}

export class DividerMoveEvent extends CustomEvent<DividerMoveDetail> {
  static readonly type = "divider-move" as const;

  constructor(detail: DividerMoveDetail) {
    super(DividerMoveEvent.type, {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * A grabbable divider component.
 * Displays a divider positioned relative to its parent.
 * Note that this implies that the parent must provide the
 * Attributes:
 * - orientation
 *   The orientation of the divider.
 *   Default: "horizontal"
 *   Values: "horizontal" | "vertical"
 *
 * - offset
 *   The offset of the divider from the top or left.
 *
 * - thickness
 *   The thickness of the divider.
 *   Default: "1px"
 *
 * - color
 *   The color of the divider.
 *   Default: white
 */
export class SuDivider extends SuElement(styles) {
  private name!: string;
  private orientation!: string;

  // current offset of divider, relative to top/left of box it is in
  private position: number = 0;
  override template(): string {
    return `
    <slot></slot>
    `;
  }

  override then() {
    this.orientation = this.getAttribute("orientation") || "horizontal";
    const thickness: number = Number(this.getAttribute("thickness")) || 1;
    const color: string = this.getAttribute("color") || "white";
    if (this.orientation === "horizontal") {
      this.style.top = `${this.position}px`;
      this.style.width = `100%`;
      this.style.height = `${thickness}px`;
    } else if (this.orientation === "vertical") {
      this.style.left = `${this.position}px`;
      this.style.height = `100%`;
      this.style.width = `${thickness}px`;
    }
    this.style.backgroundColor = color;

    // even though DragEvent is supposedly supported, the
    // draggable attribute does not seem to work, so we interpret
    // drag behaviour via pointer events instead

    let start: number;
    let stop: number;
    let isDragging: boolean = false;
    this.addEventListener("pointerdown", (event) => {
      if (this.orientation === "vertical") {
        start = event.clientX;
      } else if (this.orientation === "horizontal") {
        start = event.clientY;
      }
      isDragging = true;
    });

    // listen on the document because of the possibility of fast mouse
    // movements causing the pointer to leave the divider prematurely
    document.addEventListener("pointerup", (event) => {
      if (isDragging) {
        if (this.orientation === "vertical") {
          stop = event.clientX;
        } else if (this.orientation === "horizontal") {
          stop = event.clientY;
        }
        this.moveBy(stop - start);
        isDragging = false;
      }
    });
  }

  /**
   * Setup initial state for this divider
   *
   * @param name Identifier for this divider
   * @returns
   *
   */
  init(name: string) {
    this.name = name;
  }

  /**
   * Set the position of this divider manually
   * @param position Position of divider
   */
  setPosition(position: number) {
    this.position = position;
    if (this.orientation === "vertical") {
      this.style.left = `${this.position}px`;
    } else if (this.orientation === "horizontal") {
      this.style.top = `${this.position}px`;
    }
  }

  /**
   * Move the divider by the given offset
   * @param offset
   */
  private moveBy(offset: number) {
    this.position += offset;
    if (this.orientation === "vertical") {
      this.style.left = `${this.position}px`;
    } else if (this.orientation === "horizontal") {
      this.style.top = `${this.position}px`;
    }
    this.dispatchPositionChange(offset);
  }

  /**
   * Dispatch an event about the new position of this divider
   */
  private dispatchPositionChange(delta: number): void {
    this.dispatchEvent(
      new DividerMoveEvent({
        name: this.name,
        position: this.position,
        delta: delta,
      }),
    );
  }
}

customElements.define("su-divider", SuDivider);

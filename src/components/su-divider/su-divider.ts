import {SuElement} from "@core/su-element"
import styles from "./su-divider.css?inline";
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
  private orientation!: string; 
  private offset!: number; // current offset of divider
  override template(): string {
    return `
    <slot></slot>
    `;
  }

  override then() {
    this.orientation = this.getAttribute("orientation") || "horizontal";
    this.offset = Number(this.getAttribute("offset")) || 0;
    const thickness: number = Number(this.getAttribute("thickness")) || 1;
    const color: string = this.getAttribute("color") || "white";
    if (this.orientation === "horizontal") {
      this.style.top = `${this.offset}px`;
      this.style.width = `100%`;
      this.style.height = `${thickness}px`;
    } else if (this.orientation === "vertical") {
      this.style.left = `${this.offset}px`;
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
   * Move the divider by the given offset
   * @param deltaOffset
   */
  private moveBy(deltaOffset: number) {
    this.offset += deltaOffset;
    if (this.orientation === "vertical") {
      this.style.left = `${this.offset}px`;
    } else if (this.orientation === "horizontal") {
      this.style.top = `${this.offset}px`;
    }
  }
}

customElements.define('su-divider', SuDivider);
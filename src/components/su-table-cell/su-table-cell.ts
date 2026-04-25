import { SuElement } from "@core/su-element";
import styles from "./su-table-cell.css?inline";

export class SuTableCell extends SuElement(styles) {
  private name!: string;
  #element!: HTMLDivElement;

  override template() {
    return `
    <div class="main">
      <slot></slot>
    </div>
    `;
  }

  setName(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  override then(): void {
    this.#element = this.shadowRoot?.querySelector('.main') as HTMLDivElement;
  }

  setWidth(width: number) {
    this.#element.style.width = `${width}px`;
  }
}

customElements.define('su-table-cell', SuTableCell);

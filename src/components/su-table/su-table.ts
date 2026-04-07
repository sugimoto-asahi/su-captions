import { SuElement } from "@core/su-element";
import styles from "./su-table.css?inline";


class SuTable extends SuElement(styles) {
  override connectedCallback(): void {
    super.connectedCallback();

  }

  override render(): string {
    return `
    <div class="table">
    </div>
    <slot></slot>
    `;
  }
}

customElements.define('su-table', SuTable);

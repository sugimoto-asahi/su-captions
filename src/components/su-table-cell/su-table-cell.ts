import { SuElement } from "@core/su-element";
import styles from "./su-table-cell.css?inline";


class SuTableCell extends SuElement(styles) {
  override connectedCallback(): void {
    super.connectedCallback();
  }

  override render() {
    return `<slot></slot>`;
  }
}

customElements.define('su-table-cell', SuTableCell);

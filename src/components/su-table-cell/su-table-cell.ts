import { SuElement } from "@core/su-element";
import styles from "./su-table-cell.css?inline";

export type CellType = "startTimecode" | "endTimecode" | "content";

export interface CellContentChangedDetail {
  cellType: CellType;
  content: string;
}

type CellContentType = "div" | "area";

export class CellContentChangedEvent extends CustomEvent<CellContentChangedDetail> {
  static readonly type = "cell-content-changed" as const;

  constructor(detail: CellContentChangedDetail) {
    super(CellContentChangedEvent.type, {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

export class SuTableCell extends SuElement(styles) {
  private name!: string;
  private cellType!: CellType;
  private textArea: HTMLTextAreaElement | undefined;
  private textDiv: HTMLDivElement | undefined;
  private text: string = "Text...";
  private type: CellContentType = "div";

  override template() {
    return `
    <textarea>
    </textarea>
    <div class="text">
    </div>
    `;
  }

  setText(text: string) {
    // This function can be called either before connectedCallback()
    // or after

    // If it is called before connectedCallback(), then we just store
    // the text the user wants to set, then update the content of the
    // <textarea> or <div> when this cell is actually added to the DOM.
    //
    // If it is called after connectedCallback(), then we update the text
    // content directly
    this.text = text;
    if (this.textArea != undefined) {
      this.textArea.value = this.text;
    }

    if (this.textDiv !== undefined) {
      this.textDiv.textContent = this.text;
    }
  }

  setType(type: CellContentType) {
    this.type = type;
  }

  setCellType(type: CellType) {
    this.cellType = type;
  }

  setName(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  override then(): void {
    // if there is provided text we use it
    if (this.textContent) {
      this.text = this.textContent;
    }
    this.textArea = this.shadowRoot!.querySelector(
      "textarea",
    )! as HTMLTextAreaElement;
    this.textArea.value = this.text;
    this.textDiv = this.shadowRoot!.querySelector(".text")! as HTMLDivElement;
    this.textDiv.textContent = this.text;

    if (this.type === "area") {
      this.textDiv.hidden = true;
    } else if (this.type === "div") {
      this.textArea.hidden = true;
    }

    this.textArea.addEventListener("input", () => {
      this.dispatchEvent(
        new CellContentChangedEvent({
          cellType: this.cellType,
          content: this.textArea!.value,
        }),
      );
    });
  }
  /**
   * Set the width of this cell component
   *
   * @param width Width to apply
   */
  setWidth(width: number) {
    // The width includes both the width of the inner container
    // (either <textarea> or <div>) + the left and right padding.
    // Therefore, to find the actual width to apply to the inner container,
    // we need to find the padding first.
    const style = getComputedStyle(this);
    const padding =
      parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const innerWidth = width - padding;
    this.textDiv.style.width = `${innerWidth}px`;
    this.textArea.style.width = `${innerWidth}px`;
  }
}

customElements.define("su-table-cell", SuTableCell);

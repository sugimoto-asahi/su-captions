import { SuElement } from "@core/su-element";
import styles from "./menu-item.css?inline";

export interface MenuItemClickDetail {
    trackName: string;
}

export class MenuItemClickEvent extends CustomEvent<MenuItemClickDetail> {
    static readonly type = "menu-item-click" as const;

    constructor(detail: MenuItemClickDetail) {
        super(MenuItemClickEvent.type, {
            detail,
            bubbles: true,
            composed: true,
        });
    }
}


export class MenuItem extends SuElement(styles) {
    private trackName!: HTMLDivElement;

    override template(): string {
        return `
            <div class="track-name">Track Name</div>
            <slot></slot>
        `;
    }

    override then(): void {
        this.trackName = this.shadowRoot!.querySelector(".track-name")!;

        this.addEventListener("click", () => {
            this.dispatchEvent(new MenuItemClickEvent({
                trackName: this.trackName.textContent ?? ""
            }));
        });
    }

    /**
     * Set the display text of this menu item
     * @param text 
     */
    setDisplayText(text: string) {
        this.trackName.textContent = text;
    }
}

customElements.define('menu-item', MenuItem);
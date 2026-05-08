import { SuElement } from "@core/su-element";
import styles from "./su-control.css?inline";
import { controlEventBus } from "@core/control-event-bus";
import { settings } from "@core/settings-store";
import { ppro } from "@core/api";

import {
  AddIcon,
  DeleteIcon,
  RemoveIcon,
} from "@spectrum-web-components/icons-workflow/src/icons.js";
import { tickTimeToTimecode } from "@core/utils/time";

export class SuControl extends SuElement(styles) {
  override template() {
    return `
        <div class="icon-container">
        </div>
        `;
  }
  override then() {
    const iconContainer = this.shadowRoot!.querySelector(".icon-container");
    const iconType = this.getAttribute("icon");
    const width = Number(this.getAttribute("width")) || 24;
    const height = Number(this.getAttribute("height")) || 24;

    // load the corresponding icon's svg string
    let svgString = "";
    switch (iconType) {
      case "add":
        svgString = AddIcon({
          width: width,
          height: height,
          hidden: false,
        }) as string;
        break;
      case "delete":
        svgString = DeleteIcon({
          width: width,
          height: height,
          hidden: false,
        }) as string;
        break;
      case "remove":
        svgString = RemoveIcon({
          width: width,
          height: height,
          hidden: false,
        }) as string;
        break;
    }

    iconContainer!.insertAdjacentHTML("afterbegin", svgString);

    this.addEventListener("click", async () => {
      if (iconType === "add") {
        const project = await ppro.Project.getActiveProject();
        const sequence = await project.getActiveSequence();
        const inTickTime = await sequence.getInPoint();
        const outTickTime = await sequence.getOutPoint();

        controlEventBus.publish("add-caption", {
          startTimecode: tickTimeToTimecode(
            inTickTime,
            settings.getFrameRate(),
          ),
          endTimecode: tickTimeToTimecode(outTickTime, settings.getFrameRate()),
        });
      } else if (iconType === "remove") {
        controlEventBus.publish("remove-caption", {});
      }
    });
  }
}

customElements.define("su-control", SuControl);

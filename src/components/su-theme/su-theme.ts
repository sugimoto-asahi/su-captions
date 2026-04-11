import { SuElement } from "@core/su-element";

import hostStyles from "./su-theme.css?inline";
import globalVars from "@spectrum-web-components/styles/tokens-v2/global-vars.css?inline";
import mediumVars from "@spectrum-web-components/styles/tokens-v2/medium-vars.css?inline";
import darkVars from "@spectrum-web-components/styles/tokens-v2/dark-vars.css?inline";

/**
 * A lightweight theme wrapper component that injects Spectrum token CSS variables
 * into the shadow DOM. Drop-in replacement for <sp-theme>.
 *
 * Serves tokens from @spectrum-web-components/styles/tokens-v2:
 *   - global-vars.css
 *   - medium-vars.css
 *   - dark-vars.css
 */
class SuTheme extends SuElement(hostStyles + globalVars + mediumVars + darkVars) {
  override template(): string {
    return `<slot></slot>`;
  }
}

customElements.define("su-theme", SuTheme);

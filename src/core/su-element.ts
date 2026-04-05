
/**
 * Mixin factory for web components.
 *
 * Base class for any custom web components for this plugin that handles:
 *   - Shadow DOM attachment
 *   - Associating CSS with the shadow DOM of the web component
 *   - Rendering the class as soon as it is added to the DOM
 *  
 *
 * Usage:
 *   import styles from './my-component.css?inline'; // Must be imported as raw string
 *   import { SuElement } from '../core/su-element';
 *
 *   class MyComponent extends SuElement(styles) {
 *     render() {
 *       return `<div>Hello</div>`;
 *     }
 *   }
 * @param {string} styles - Raw CSS style string to be applied to the shadow DOM of this
 * custom element
 *
 */
export function SuElement(styles: string) {
  // construct the stylesheet
  const htmlStyles = `<style>${styles}</style>`;


  abstract class SuElementBase extends HTMLElement {
    /**
     * Lifecycle callback
     */
    connectedCallback() {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot!.innerHTML = htmlStyles + this.render();
    }

    /**
     * Render the HTML
     * @return HTML string to be rendered
     */
    abstract render(): string;
  };

  return SuElementBase
}


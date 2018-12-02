/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';




export namespace Components {

  interface BomradarComponent {
    'height': number;
    'imagecount': string;
    'product': string;
    'width': number;
  }
  interface BomradarComponentAttributes extends StencilHTMLAttributes {
    'height'?: number;
    'imagecount'?: string;
    'product'?: string;
    'width'?: number;
  }
}

declare global {
  interface StencilElementInterfaces {
    'BomradarComponent': Components.BomradarComponent;
  }

  interface StencilIntrinsicElements {
    'bomradar-component': Components.BomradarComponentAttributes;
  }


  interface HTMLBomradarComponentElement extends Components.BomradarComponent, HTMLStencilElement {}
  var HTMLBomradarComponentElement: {
    prototype: HTMLBomradarComponentElement;
    new (): HTMLBomradarComponentElement;
  };

  interface HTMLElementTagNameMap {
    'bomradar-component': HTMLBomradarComponentElement
  }

  interface ElementTagNameMap {
    'bomradar-component': HTMLBomradarComponentElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
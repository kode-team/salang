import { describe, it, expect } from 'vitest';
import * as salangParser from "../../src/language/salang";

describe('SaLang @template Parsing Tests', () => {
  it('should correctly parse conditional template', () => {
    const code = `
      @component MyComponent {
        @template {
          div.container {
            @if var(isVisible) {
              span "Visible Content"
            } @else {
              span "Hidden Content"
            }
          }
        }
      }
    `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'MyComponent',
      body: [{
        type: 'Template',
        content: [{
          type: 'Element',
          tag: 'div',
          attributes: [
            { type: 'Attribute', id: 'class', value: ['container'] }
          ],
          content: [{
            type: 'Conditional',
            ifContent: {
              type: 'IfConditional',
              condition: [
                { type: 'Variable', varName: 'isVisible' }
              ],
              content: [
                {
                  type: 'Element', tag: 'span', attributes: [], content: [
                    { type: "TextNode", value: "Visible Content" }
                  ]
                }
              ]
            },
            elseContent: {
              type: 'ElseConditional',
              content: [
                {
                  type: 'Element', tag: 'span', attributes: [], content: [
                    { type: "TextNode", value: "Hidden Content" }]
                }
              ]
            }
          }]
        }]
      }]
    }]);
  });

  it('should correctly parse repeated template', () => {
    const code = `
      @component MyComponent {
        @template {
          @repeat item in var(items) {
            div.item "Item: " var(item)
          }
        }
      }
    `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'MyComponent',
      body: [{
        type: 'Template',
        content: [{
          type: 'Repeat',
          variable: 'item',
          collection: [
            { type: 'Variable', varName: 'items' }
          ],
          content: [{
            type: 'Element',
            tag: 'div',
            attributes: [
              { type: 'Attribute', id: 'class', value: ['item'] }
            ],
            content: [
              {
                type: 'TextNode',
                value: 'Item: '
              }, { type: 'Variable', varName: 'item' }]
          }]
        }]
      }]
    }]);
  });

  it('should handle mixed content types correctly', () => {
    const code = `
      @component MixedContentComponent {
        @template {
          div.item "Item: " var(itemNumber) " Price: " var(price)
        }
      }
    `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'MixedContentComponent',
      body: [{
        type: 'Template',
        content: [{
          type: 'Element',
          tag: 'div',
          attributes: [{ type: 'Attribute', id: 'class', value: ['item'] }],
          content: [
            { type: 'TextNode', value: 'Item: ' },
            { type: 'Variable', varName: 'itemNumber' },
            { type: 'TextNode', value: ' Price: ' },
            { type: 'Variable', varName: 'price' }
          ]
        }]
      }]
    }]);
  });

  it('should handle special characters correctly', () => {
    const code = `
      @component SpecialCharactersComponent {
        @template {
          div.content "Text with special characters: {}, \\"quotes\\""
        }
      }
    `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'SpecialCharactersComponent',
      body: [{
        type: 'Template',
        content: [{
          type: 'Element',
          tag: 'div',
          attributes: [{ type: 'Attribute', id: 'class', value: ['content'] }],
          content: [
            { type: 'TextNode', value: 'Text with special characters: {}, "quotes"' }
          ]
        }]
      }]
    }]);
  });
});

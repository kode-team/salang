import { describe, it, expect } from 'vitest';
import salangParser from "../src/language/salang";

describe('Style Parsing Tests', () => {
  const styleCode = `
    @component ExampleComponent {
      @style {
        .main-component {
          color: var(primaryColor);
          padding: 20px;
        }
        .hidden {
          display: none;
        }
      }
    }
  `;

  it('should correctly parse @style blocks', () => {
    const result = salangParser.parse(styleCode);

    expect(result).toEqual([
      {
        type: "Component",
        id: "ExampleComponent",
        body: [
          {
            type: 'Style',
            rules: [
              {
                type: 'CSSRule',
                selector: '.main-component',
                properties: [
                  {
                    type: 'CSSProperty', property: 'color', value: {
                      type: 'Variable',
                      varName: 'primaryColor'
                    }
                  },
                  { type: 'CSSProperty', property: 'padding', value: '20px' }
                ]
              },
              {
                type: 'CSSRule',
                selector: '.hidden',
                properties: [
                  { type: 'CSSProperty', property: 'display', value: 'none' }
                ]
              }
            ]
          }
        ]
      }

    ]);
  });
});

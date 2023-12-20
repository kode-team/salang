import { describe, it, expect } from 'vitest';
import salangParser from "../src/language/salang";

describe('MyComponent AST Tests', () => {
  const myComponentCode = `
  @component MyComponent {
    @state {
      counter: 0;
      isVisible: true;
    }

    @attribute title: "Interactive Component";
    @attribute primaryColor: var(themeColor);
  
    @style {
      .main-component {
        color: var(primaryColor);
        padding: 20px;
      }
      .hidden {
        display: none;
      }
      .visible-section {
        display: block;
      }
      .toggle-btn {
        padding: 10px;
        background-color: var(buttonColor);
      }
    }
    @function toggleVisibility() {
      @js {
        this.isVisible = !this.isVisible;
      }
    }
    @event click on .toggle-btn {
      @js {
        toggleVisibility();
      }
    }

    @template {
      div.main-component {
        @if var(isVisible) {
          div.visible-section {
            "This is the visible section"
          }
        } @else {
          div.hidden {
            "This is the hidden section"
          }
        }
        button.toggle-btn {
          "Toggle Visibility"
        }
      }
    }
  }
  `;

  const expectedAST = [{
    type: 'Component',
    id: 'MyComponent',
    body: [
      {
        type: 'StateGroup',
        states: [
          {
            type: 'State', id: 'counter', value: {
              "raw": "0",
              "type": "NumberLiteral",
              "value": 0,
            }
          },
          {
            type: 'State', id: 'isVisible', value: {
              type: "BooleanLiteral",
              value: true,
            }
          }
        ]
      },
      {
        type: "Attribute",
        id: "title",
        value: {
          type: "StringLiteral", value: "Interactive Component"
        }
      },
      {
        type: "Attribute",
        id: "primaryColor",
        value: { type: "Variable", varName: "themeColor" }
      },
      {
        type: 'Style',
        rules: [
          {
            type: 'CSSRule',
            selector: '.main-component',
            properties: [
              {
                "property": "color",
                "type": "CSSProperty",
                "value": {
                  "type": "Variable",
                  "varName": "primaryColor",
                },
              },
              {
                "property": "padding",
                "type": "CSSProperty",
                "value": "20px",
              },
            ]
          },
          {
            type: 'CSSRule', selector: '.hidden', properties: [
              {
                "property": "display",
                "type": "CSSProperty",
                "value": "none",
              }
            ]
          },
          {
            type: 'CSSRule',
            selector: '.visible-section',
            properties: [
              {
                "property": "display",
                "type": "CSSProperty",
                "value": "block",
              }
            ]
          },
          {
            type: 'CSSRule', selector: '.toggle-btn', properties: [
              {
                "property": "padding",
                "type": "CSSProperty",
                "value": "10px",
              },
              {
                "property": "background-color",
                "type": "CSSProperty",
                "value": {
                  "type": "Variable",
                  "varName": "buttonColor",
                },
              }
            ]
          }
        ]
      },
      {
        type: 'Function',
        functionName: 'toggleVisibility',
        args: [],
        body: [{
          type: 'JavaScript', code: [
            {
              "type": "JavaScriptCodeChunk",
              "value": "this.isVisible = !this.isVisible;",
            },
          ]
        }]
      },
      {
        type: 'Event',
        eventType: 'click',
        args: [],
        body: [{
          type: 'JavaScript', code: [
            {
              "type": "JavaScriptCodeChunk",
              "value": "toggleVisibility();",
            }
          ]
        }],
        selector: '.toggle-btn'
      },
      {
        type: 'Template',
        content: [
          {
            type: 'Element',
            tag: 'div',
            attributes: [{ type: 'Attribute', id: 'class', value: ['main-component'] }],
            content: [
              {
                type: 'Conditional',
                ifContent: {
                  type: 'IfConditional',
                  condition: [{ type: 'Variable', varName: 'isVisible' }],
                  content: [
                    {
                      type: 'Element',
                      tag: 'div',
                      attributes: [{ type: 'Attribute', id: 'class', value: ['visible-section'] }],
                      content: [{ type: 'TextNode', value: 'This is the visible section' }]
                    }
                  ]
                },
                elseContent: {
                  type: 'ElseConditional', content: [
                    {
                      type: 'Element',
                      tag: 'div',
                      attributes: [{ type: 'Attribute', id: 'class', value: ['hidden'] }],
                      content: [{ type: 'TextNode', value: 'This is the hidden section' }]
                    }
                  ]
                }
              },
              {
                type: 'Element',
                tag: 'button',
                attributes: [{ type: 'Attribute', id: 'class', value: ['toggle-btn'] }],
                content: [{ type: 'TextNode', value: 'Toggle Visibility' }]
              }
            ]
          }
        ]
      }
    ]
  }];

  it('should generate the correct AST for MyComponent', () => {
    const result = salangParser.parse(myComponentCode.trim());

    expect(result).toEqual(expectedAST);
  });

  // 추가적인 테스트 케이스...
});

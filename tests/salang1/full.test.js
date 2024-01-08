import { describe, it, expect } from 'vitest';
import * as salangParser from "../../src/language/salang";

describe('MyComponent AST Tests', () => {
  const myComponentCode = `
  @component MyComponent {
    @state {
      counter: 0;
      items: ["Item 1", "Item 2"];
    }
  
    @attribute title: "Default Title";
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


    @function incrementCount() {
      @js {
        counter++;
      }

    }
  
    @onMounted {
      @js {
        console.log("Component mounted");
      }

    }
  
    @jsx Header {
      <header>
        <h1>My Name: {title}</h1>
      </header>
    }


  
    @template {
      div.main-component {
        "Main content here"
        Header {}
        button(onClick: incrementCount) { "Increment" }
        p { "Count: {count}" }
        @repeat item in items {
          @js { 
            console.log(item);
          }
          div { "{item}" }
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
            type: 'State', id: 'items', value: {
              type: "ArrayLiteral",
              elements: [
                { type: "StringLiteral", value: "Item 1" },
                { type: "StringLiteral", value: "Item 2" }
              ]
            }
          }
        ]
      },
      {
        type: "Attribute",
        id: "title",
        value: {
          type: "StringLiteral", value: "Default Title"
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
        functionName: 'incrementCount',
        args: [],
        body: [{
          type: 'JavaScript', code: [
            {
              "type": "JavaScriptCodeChunk",
              "value": "counter++;",
            },
          ]
        }]
      },
      {
        type: "ComponentEvent",
        eventType: "Mounted",
        body: [
          {
            type: "JavaScript",
            code: [
              {
                "type": "JavaScriptCodeChunk",
                "value": "console.log(\"Component mounted\");",
              },
            ]
          }
        ]
      },
      {
        type: "JsxTemplate",
        name: "Header",
        content: [
          {
            type: "jsxElement",
            tagName: "header",
            attributes: [],
            children: [
              {
                type: "jsxElement",
                tagName: "h1",
                attributes: [],
                children: [
                  {
                    type: "jsxText",
                    text: "My Name: {title}",
                  },
                ]
              }, {
                type: "jsxText",
                text: "\n      ",
              }
            ]
          }
        ]
      },
      {
        type: 'Template',
        content: [
          {
            type: 'Element',
            tag: 'div',
            attributes: [{ type: 'Attribute', id: 'class', value: ['main-component'] }],
            content: [
              { type: 'TextNode', value: 'Main content here' },
              { type: 'Element', 'tag': 'Header', attributes: [], content: [], },
              {
                type: 'Element',
                tag: 'button',
                attributes: [{ type: 'Attribute', id: 'onClick', value: ['incrementCount'] }],
                content: [{ type: 'TextNode', value: 'Increment' }]
              },
              {
                type: 'Element',
                tag: 'p',
                attributes: [],
                content: [{ type: 'TextNode', value: 'Count: {count}' }]
              },
              {
                type: 'Repeat',
                variable: 'item',
                collection: [{ type: 'JavaScriptCodeChunk', value: 'items' }],
                content: [
                  {
                    type: 'JavaScript',
                    code: [
                      {
                        "type": "JavaScriptCodeChunk",
                        "value": "console.log(item);",
                      },
                    ]
                  },
                  {
                    type: 'Element',
                    tag: 'div',
                    attributes: [],
                    content: [
                      { type: 'TextNode', value: '{item}' }
                    ]
                  }
                ]
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

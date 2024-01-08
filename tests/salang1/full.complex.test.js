import { describe, it, expect } from 'vitest';
import * as salangParser from "../../src/language/salang";

describe('Complex Component AST Tests', () => {
  const complexComponentCode = `
  @component ComplexComponent {
    @state {
      items: [];
      selectedItem: null;
    }

    @attribute defaultColor: "blue";

    @style {
      .item {
        color: var(defaultColor);
        padding: 10px;
        border: 1px solid black;
      }
      .selected {
        background-color: yellow;
      }
    }

    @function selectItem(itemId) {
      @js {
        this.selectedItem = this.items.find(item => item.id === itemId);
      }
    }

    @event click on .item {
      @js {
        selectItem(var(itemId));
      }
    }

    @template {
      ul {
        @repeat item in var(items) {
          li.item(id: "item-" var(item.id)) {
            "Item: " var(item.name)
            
          }
        }
      }
    }
  }
  `;

  const expectedAST = [
    {
      "type": "Component",
      "id": "ComplexComponent",
      "body": [
        {
          "type": "StateGroup",
          "states": [
            {
              "type": "State",
              "id": "items",
              "value": {
                "type": "ArrayLiteral",
                "elements": []
              }
            },
            {
              "type": "State",
              "id": "selectedItem",
              "value": "null"
            }
          ]
        },
        {
          "type": "Attribute",
          "id": "defaultColor",
          "value": {
            "type": "StringLiteral",
            "value": "blue"
          }
        },
        {
          "type": "Style",
          "rules": [
            {
              "type": "CSSRule",
              "selector": ".item",
              "properties": [
                {
                  "type": "CSSProperty",
                  "property": "color",
                  "value": {
                    "type": "Variable",
                    "varName": "defaultColor"
                  }
                },
                {
                  "type": "CSSProperty",
                  "property": "padding",
                  "value": "10px"
                },
                {
                  "type": "CSSProperty",
                  "property": "border",
                  "value": "1px solid black"
                }
              ]
            },
            {
              "type": "CSSRule",
              "selector": ".selected",
              "properties": [
                {
                  "type": "CSSProperty",
                  "property": "background-color",
                  "value": "yellow"
                }
              ]
            }
          ]
        },
        {
          "type": "Function",
          "functionName": "selectItem",
          "args": [
            "itemId"
          ],
          "body": [
            {
              "type": "JavaScript",
              "code": [
                {
                  "type": "JavaScriptCodeChunk",
                  "value": "this.selectedItem = this.items.find(item => item.id === itemId);"
                }
              ]
            }
          ]
        },
        {
          "type": "Event",
          "eventType": "click",
          "args": [],
          "body": [
            {
              "type": "JavaScript",
              "code": [
                {
                  "type": "JavaScriptCodeChunk",
                  "value": "selectItem(var(itemId));"
                }
              ]
            }
          ],
          "selector": ".item"
        },
        {
          "type": "Template",
          "content": [
            {
              "type": "Element",
              "tag": "ul",
              "attributes": [],
              "content": [
                {
                  "type": "Repeat",
                  "variable": "item",
                  "collection": [
                    {
                      "type": "Variable",
                      "varName": "items"
                    }
                  ],
                  "content": [
                    {
                      "type": "Element",
                      "tag": "li",
                      "attributes": [
                        {
                          "type": "Attribute",
                          "id": "id",
                          "value": [
                            {
                              "type": "StringLiteral",
                              "value": "item-"
                            },
                            {
                              "type": "Variable",
                              "varName": "item.id"
                            }
                          ]
                        },
                        {
                          "type": "Attribute",
                          "id": "class",
                          "value": [
                            "item"
                          ]
                        }
                      ],
                      "content": [
                        {
                          "type": "TextNode",
                          "value": "Item: "
                        },
                        {
                          "type": "Variable",
                          "varName": "item.name"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  it('should generate the correct AST for ComplexComponent', () => {
    const result = salangParser.parse(complexComponentCode.trim());
    expect(result).toEqual(expectedAST);
  });

  // 추가적인 복잡한 시나리오를 위한 테스트 케이스를 계속해서 작성할 수 있습니다.
});

// tests/salangParser.test.js
import { describe, it, expect } from "vitest";
import * as salangParser from "../../src/language/salang";

describe("SaLang Parser - Template with Attributes Parsing", () => {
  it("should parse a template with attributes, conditional, and repeat rendering", () => {
    const input = `
      @component MyComponent {
        @template {
          div {
            @attribute class: "my-div";
            "Content of the div"

            @if var(isVisible) {
              span { 
                @attribute class: "visible-span"; 
                "Visible Content"
              }
            } @else {
              span { 
                @attribute class: "hidden-span"; 
                "Hidden Content"
              }
            }

            @repeat item in var(items) {
              div { 
                @attribute class: var(item.class); 
                var(item.text) 
              }
            }

          }
        }
      }
    `;
    const result = salangParser.parse(input.trim());

    expect(result).toEqual([
      {
        type: "Component",
        id: "MyComponent",
        body: [
          {
            type: "Template",
            content: [
              {
                type: "Element",
                tag: "div",
                attributes: [{
                  type: "Attribute", id: "class", value: [
                    { type: "StringLiteral", value: "my-div" }
                  ]
                }],
                content: [
                  { type: "TextNode", value: "Content of the div" },
                  {
                    type: "Conditional",
                    ifContent: {
                      type: "IfConditional",
                      condition: [
                        { type: "Variable", varName: "isVisible" }
                      ],
                      content: [
                        {
                          type: "Element",
                          tag: "span",
                          attributes: [{
                            type: "Attribute", id: "class", value: [
                              { type: "StringLiteral", value: "visible-span" }
                            ]
                          }],
                          content: [
                            { type: "TextNode", value: "Visible Content" }
                          ]
                        }
                      ]
                    },
                    elseContent: {
                      type: "ElseConditional",
                      content: [
                        {
                          type: "Element",
                          tag: "span",
                          attributes: [{
                            type: "Attribute", id: "class", value: [
                              { type: "StringLiteral", value: "hidden-span" }
                            ]
                          }],
                          content: [{
                            type: "TextNode",
                            value: "Hidden Content"
                          }]
                        }
                      ]
                    }
                  },
                  {
                    type: "Repeat",
                    variable: "item",
                    collection: [{
                      type: "Variable",
                      varName: "items"
                    }],
                    content: [
                      {
                        type: "Element",
                        tag: "div",
                        attributes: [{
                          type: "Attribute", id: "class", value: [{
                            type: "Variable",
                            varName: "item.class"
                          }]
                        }],
                        content: [
                          { type: "Variable", varName: "item.text" }
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
    ]);
  });

  // 추가적인 테스트 케이스들을 여기에 작성할 수 있습니다.
});

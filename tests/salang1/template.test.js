// tests/salangParser.test.js
import { describe, it, expect } from "vitest";
import * as salangParser from "../../src/language/salang";

describe("SaLang Parser - Template Syntax Parsing", () => {
  it.only("should parse element with CSS selector style classes and attributes", () => {
    const input = `
      @component myComponent {
        @template {
          div.class1.class2 {
            "This is a div with two classes"
          }
          button {
            @attribute class: "toggle-btn";
            "Click me"
          }
        }
      }
    `;
    const result = salangParser.parse(input);
    expect(result).toEqual([
      {
        type: "Component",
        id: "myComponent",
        body: [
          {
            type: "Template",
            content: [
              {
                type: "Element",
                tag: "div",
                attributes: [{ type: "Attribute", id: "class", value: ["class1", "class2"] }],
                content: [{
                  type: "TextNode",
                  value: "This is a div with two classes"
                }]
              },
              {
                type: "Element",
                tag: "button",
                attributes: [{
                  type: "Attribute", id: "class", value: [
                    { type: "StringLiteral", value: "toggle-btn" }
                  ]
                }],
                content: [{ type: "TextNode", value: "Click me" }]
              }
            ]
          }
        ]
      }
    ]);
  });

  // 여기에 추가적인 테스트 케이스를 작성할 수 있습니다.
});

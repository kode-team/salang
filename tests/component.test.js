// tests/salangParser.test.js
import { describe, it, expect } from "vitest";
import salangParser from "../src/language/salang";

describe("SaLang Parser - Component Parsing", () => {
  it("should parse a basic component with no attributes or content", () => {
    const input = `
      @component emptyComponent {}
    `;
    const result = salangParser.parse(input.trim());
    expect(result).toEqual([
      {
        type: "Component",
        id: "emptyComponent",
        body: []
      }
    ]);
  });

  it("should parse a component with attributes", () => {
    const input = `
      @component myComponent {
        @attribute title: "Test Component";
      }
    `;
    const result = salangParser.parse(input.trim());
    expect(result).toEqual([
      {
        type: "Component",
        id: "myComponent",
        body: [
          {
            type: "Attribute",
            id: "title",
            value: "Test Component"
          }
        ]
      }
    ]);
  });

  it("should parse a component with nested elements", () => {
    const input = `
      @component nestedComponent {
        @template {
          div {
            Hello World
            yellow
            blue
            red
            span { This is a test }
          }
        }
      }
    `;
    const result = salangParser.parse(input.trim());
    expect(result).toEqual([
      {
        type: "Component",
        id: "nestedComponent",
        body: [
          {
            type: "Template",
            content: [
              {
                type: "Element",
                tag: "div",
                content: [
                  { type: "TextNode", value: "Hello World" },
                  { type: "TextNode", value: "yellow" },
                  { type: "TextNode", value: "blue" },
                  { type: "TextNode", value: "red" },
                  {
                    type: "Element",
                    tag: "span",
                    content: [{ type: "TextNode", value: "This is a test" }]

                  }
                ]
              }
            ]
          }
        ]
      }
    ]);
  });

  // 여기에 추가 테스트 케이스를 계속 작성할 수 있습니다.
});

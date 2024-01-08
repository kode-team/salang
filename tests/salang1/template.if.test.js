// tests/salangParser.test.js
import { describe, it, expect } from "vitest";
import * as salangParser from "../../src/language/salang";

describe("SaLang Parser - Advanced Template Parsing", () => {
    it("should parse conditional rendering with @if and @else", () => {
        const input = `
      @component myComponent {
        @template {
          @if var(isVisible) {
            div { "Visible Content" }
          } @else {
            div { "Hidden Content" }
          }
        }
      }
    `;
        const result = salangParser.parse(input.trim());
        expect(result).toEqual([
            {
                type: "Component",
                id: "myComponent",
                body: [
                    {
                        type: "Template",
                        content: [
                            {
                                type: "Conditional",
                                ifContent: {
                                    type: "IfConditional",
                                    condition: [
                                        { type: "Variable", varName: "isVisible" }
                                    ],
                                    content: [
                                        {
                                            type: "Element", tag: "div", attributes: [], content: [
                                                { type: "TextNode", value: "Visible Content" }
                                            ]
                                        }
                                    ]
                                },
                                elseContent: {
                                    type: "ElseConditional",
                                    content: [
                                        {
                                            type: "Element", tag: "div", attributes: [], content: [
                                                { type: "TextNode", value: "Hidden Content" }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        ]);
    });

    // 필요에 따라 추가적인 테스트 케이스를 작성할 수 있습니다.
});

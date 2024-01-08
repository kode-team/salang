// tests/salangParser.test.js
import { describe, it, expect } from "vitest";
import * as salangParser from "../../src/language/salang";

describe("SaLang Parser - Repeat Rendering with Conditional Rendering", () => {
    it("should parse repeat rendering with nested if-else inside", () => {
        const input = `
      @component myComponent {
        @template {
            @repeat item in var(items) {
                @if var(item.isVisible) {
                    div { "Visible Item" }
                } @else {
                    div { "Hidden Item" }
                }
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
                                type: "Repeat",
                                variable: "item",
                                collection: [
                                    { type: "Variable", varName: "items" }
                                ],
                                content: [
                                    {
                                        type: "Conditional",
                                        ifContent: {
                                            type: "IfConditional",
                                            condition: [
                                                { type: "Variable", varName: "item.isVisible" }
                                            ],
                                            content: [
                                                {
                                                    type: "Element", tag: "div", attributes: [], content: [
                                                        { type: "TextNode", value: "Visible Item" }
                                                    ]
                                                }
                                            ]
                                        },
                                        elseContent: {
                                            type: "ElseConditional",
                                            content: [
                                                {
                                                    type: "Element", tag: "div", attributes: [], content: [
                                                        { type: "TextNode", value: "Hidden Item" }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]);
    });

    // 필요에 따라 추가적인 복잡한 테스트 케이스를 작성할 수 있습니다.
});

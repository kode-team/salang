import { describe, it, expect } from "vitest";
import salangParser from "../src/language/salang";

describe("SaLang Parser - Function Parsing with var() in Selector", () => {
    it("should parse a function with var() in @selector", () => {
        const input = `
      @component myComponent {
        @function myFunction(param1, param2) {
          @selector .button {
            background-color: var(param1);
            color: var(param2);
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
                        type: "Function",
                        functionName: "myFunction",
                        args: ["param1", "param2"],
                        body: [
                            {
                                type: "CSSRule",
                                selector: ".button",
                                properties: [
                                    { type: "CSSPropertyWithVar", property: "background-color", value: { type: "Variable", varName: "param1" } },
                                    { type: "CSSPropertyWithVar", property: "color", value: { type: "Variable", varName: "param2" } }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]);
    });

    // 추가적인 복잡한 함수 시나리오를 위한 테스트 케이스를 계속해서 작성할 수 있습니다.
});

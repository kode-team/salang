import { describe, it, expect } from "vitest";
import * as salangParser from "../../src/language/salang";

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

    it("should parse a function without parameters", () => {
        const input = `
      @component myComponent {
        @function myFunctionWithoutParams() {
          @selector .simple-button {
            background-color: blue;
            color: white;
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
                        functionName: "myFunctionWithoutParams",
                        args: [],
                        body: [
                            {
                                type: "CSSRule",
                                selector: ".simple-button",
                                properties: [
                                    { type: "CSSProperty", property: "background-color", value: "blue" },
                                    { type: "CSSProperty", property: "color", value: "white" }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]);
    });


    it("should parse a function without parameters", () => {
        const input = `
      @component myComponent {
        @function myFunctionWithoutParams {
          @selector .simple-button {
            background-color: blue;
            color: white;
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
                        functionName: "myFunctionWithoutParams",
                        args: [],
                        body: [
                            {
                                type: "CSSRule",
                                selector: ".simple-button",
                                properties: [
                                    { type: "CSSProperty", property: "background-color", value: "blue" },
                                    { type: "CSSProperty", property: "color", value: "white" }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]);
    });
});

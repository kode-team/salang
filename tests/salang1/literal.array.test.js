import { describe, it, expect } from 'vitest';
import * as salangParser from "../../src/language/salang";

describe('Array Literal Parsing Tests', () => {
    it('should correctly parse an array literal', () => {
        const input = `
      @component MyComponent {
        @state items: ["Item1", "Item2", "Item3"];
      }
    `;
        const result = salangParser.parse(input.trim());
        expect(result).toEqual([
            {
                type: 'Component',
                id: 'MyComponent',
                body: [
                    {
                        type: 'State',
                        id: 'items',
                        value: {
                            type: 'ArrayLiteral',
                            elements: ["Item1", "Item2", "Item3"].map(item => ({
                                type: 'StringLiteral',
                                value: item
                            }))
                        }
                    }
                ]
            }
        ]);
    });

    it('should correctly parse an empty array literal', () => {
        const input = `
          @component TestComponent {
            @state emptyArray: [];
          }
        `;
        const result = salangParser.parse(input.trim());
        expect(result).toEqual([
            {
                type: 'Component',
                id: 'TestComponent',
                body: [
                    {
                        type: 'State',
                        id: 'emptyArray',
                        value: {
                            type: 'ArrayLiteral',
                            elements: []
                        }
                    }
                ]
            }
        ]);
    });

    it('should parse an array with mixed data types', () => {
        const input = `
          @component MixedComponent {
            @state mixedArray: ["text", 123, true];
          }
        `;
        const result = salangParser.parse(input.trim());
        expect(result).toEqual([
            {
                type: 'Component',
                id: 'MixedComponent',
                body: [
                    {
                        type: 'State',
                        id: 'mixedArray',
                        value: {
                            type: 'ArrayLiteral',
                            elements: [
                                { type: 'StringLiteral', value: "text" },
                                { type: 'NumberLiteral', value: 123, raw: "123" },
                                { type: 'BooleanLiteral', value: true }
                            ]
                        }
                    }
                ]
            }
        ]);
    });

    it('should handle nested array literals', () => {
        const input = `
          @component NestedComponent {
            @state nestedArray: [["Item1", "Item2"], ["Item3", "Item4"]];
          }
        `;
        const result = salangParser.parse(input.trim());
        expect(result).toEqual([
            {
                type: 'Component',
                id: 'NestedComponent',
                body: [
                    {
                        type: 'State',
                        id: 'nestedArray',
                        value: {
                            type: 'ArrayLiteral',
                            elements: [
                                {
                                    type: 'ArrayLiteral',
                                    elements: [
                                        { type: 'StringLiteral', value: "Item1" },
                                        { type: 'StringLiteral', value: "Item2" }
                                    ]
                                },
                                {
                                    type: 'ArrayLiteral',
                                    elements: [
                                        { type: 'StringLiteral', value: "Item3" },
                                        { type: 'StringLiteral', value: "Item4" }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        ]);
    });

    it('should parse array literals containing variables', () => {
        const input = `
          @component VariableArrayComponent {
            @state arrayVar: ["Item1", var(myVar)];
          }
        `;
        const result = salangParser.parse(input.trim());
        expect(result).toEqual([
            {
                type: 'Component',
                id: 'VariableArrayComponent',
                body: [
                    {
                        type: 'State',
                        id: 'arrayVar',
                        value: {
                            type: 'ArrayLiteral',
                            elements: [
                                { type: 'StringLiteral', value: "Item1" },
                                { type: 'Variable', varName: "myVar" }
                            ]
                        }
                    }
                ]
            }
        ]);
    });

    it('should report an error for malformed array literals', () => {
        expect(() => {
            const input = `
              @component ErrorComponent {
                @state errorArray: ["Unclosed, 123, true];
              }
            `;
            salangParser.parse(input.trim());
        }).toThrow();
    });


});

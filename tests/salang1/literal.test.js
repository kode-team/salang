import { describe, it, expect } from 'vitest';
import * as salangParser from "../../src/language/salang";

describe('Literal Parsing Tests', () => {
    it('should parse string literals correctly', () => {
        const input = `
          @component StringComponent {
            @state stringState: "Hello, World!";
          }
        `;
        const result = salangParser.parse(input.trim());
        expect(result).toEqual([
            {
                type: 'Component',
                id: 'StringComponent',
                body: [
                    {
                        type: 'State',
                        id: 'stringState',
                        value: {
                            type: 'StringLiteral',
                            value: "Hello, World!"
                        }
                    }
                ]
            }
        ]);
    });

    it('should parse number literals correctly', () => {
        const input = `
          @component NumberComponent {
            @state numberState: 12345;
          }
        `;
        const result = salangParser.parse(input.trim());
        expect(result).toEqual([
            {
                type: 'Component',
                id: 'NumberComponent',
                body: [
                    {
                        type: 'State',
                        id: 'numberState',
                        value: {
                            type: 'NumberLiteral',
                            value: 12345,
                            raw: "12345"
                        }
                    }
                ]
            }
        ]);
    });

    it('should parse floating-point number literals correctly', () => {
        const input = `
          @component FloatComponent {
            @state floatState: 123.45;
          }
        `;
        const result = salangParser.parse(input.trim());
        expect(result).toEqual([
            {
                type: 'Component',
                id: 'FloatComponent',
                body: [
                    {
                        type: 'State',
                        id: 'floatState',
                        value: {
                            type: 'NumberLiteral',
                            value: 123.45,
                            raw: "123.45"
                        }
                    }
                ]
            }
        ]);
    });


    it('should parse boolean literals correctly', () => {
        const input = `
          @component BooleanComponent {
            @state booleanState: true;
          }
        `;
        const result = salangParser.parse(input.trim());
        expect(result).toEqual([
            {
                type: 'Component',
                id: 'BooleanComponent',
                body: [
                    {
                        type: 'State',
                        id: 'booleanState',
                        value: {
                            type: 'BooleanLiteral',
                            value: true
                        }
                    }
                ]
            }
        ]);
    });

    it('should parse floating-point numbers with exponential notation correctly', () => {
        const input = `
          @component ExponentialComponent {
            @state expNumber: 1.23e4;
            @state expNumberNegative: 5.67e-3;
            @state expNumberPositive: 8.90e+2;
          }
        `;
        const result = salangParser.parse(input.trim());
        expect(result).toEqual([
            {
                type: 'Component',
                id: 'ExponentialComponent',
                body: [
                    {
                        type: 'State',
                        id: 'expNumber',
                        value: {
                            type: 'NumberLiteral',
                            value: 1.23e4,
                            raw: '1.23e4'
                        }
                    },
                    {
                        type: 'State',
                        id: 'expNumberNegative',
                        value: {
                            type: 'NumberLiteral',
                            value: 5.67e-3,
                            raw: '5.67e-3'
                        }
                    },
                    {
                        type: 'State',
                        id: 'expNumberPositive',
                        value: {
                            type: 'NumberLiteral',
                            value: 8.90e+2,
                            raw: '8.90e+2'
                        }
                    }
                ]
            }
        ]);
    });


});

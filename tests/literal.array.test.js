import { describe, it, expect } from 'vitest';
import salangParser from "../src/language/salang";

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

    // 추가적인 복잡한 시나리오를 위한 테스트 케이스를 계속해서 작성할 수 있습니다.
});

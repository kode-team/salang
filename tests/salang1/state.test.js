import { describe, it, expect } from 'vitest';
import * as salangParser from "../../src/language/salang";

describe('SaLang @state Parsing Tests', () => {
  it('should correctly parse single @state declaration', () => {
    const code = `
      @component MyComponent {
        @state counter: 0;
      }
    `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'MyComponent',
      body: [{
        type: 'State',
        id: 'counter',
        value: {
          type: "NumberLiteral", value: 0, raw: "0"
        }
      }]
    }]);
  });

  it('should correctly parse grouped @state declarations', () => {
    const code = `
      @component MyComponent {
        @state {
            counter: 0;
            isLoading: false;
        }
      }
    `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'MyComponent',
      body: [{
        type: 'StateGroup',
        states: [
          {
            type: "State", id: 'counter', value: {
              type: "NumberLiteral", value: 0, raw: "0"
            }
          },
          {
            type: "State", id: 'isLoading', value: {
              type: "BooleanLiteral", value: false
            }
          }
        ]
      }]
    }]);
  });

  it('should handle nested @state groups', () => {
    const code = `
          @component ComplexComponent {
            @state {
              user: {
                name: "John";
                age: 30;
              };
              settings: {
                theme: "dark";
                notifications: true;
              };
            }
          }
        `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'ComplexComponent',
      body: [{
        type: 'StateGroup',
        states: [
          {
            type: "State",
            id: 'user',
            value: {
              type: "StateGroup",
              states: [
                { type: "State", id: 'name', value: { type: "StringLiteral", value: "John" } },
                {
                  type: "State", id: 'age', value: {
                    type: "NumberLiteral", value: 30, raw: "30"
                  }
                }
              ]
            }
          },
          {
            type: "State",
            id: 'settings',
            value: {
              type: "StateGroup",
              states: [
                { type: "State", id: 'theme', value: { type: "StringLiteral", value: "dark" } },
                {
                  type: "State", id: 'notifications', value: {
                    type: "BooleanLiteral", value: true
                  }
                }
              ]
            }
          }
        ]
      }]
    }]);
  });

  it('should handle mixed single and grouped @state declarations', () => {
    const code = `
          @component MixedComponent {
            @state singleState: true;
            @state {
              groupState1: 1;
              groupState2: "test";
            }
          }
        `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'MixedComponent',
      body: [
        {
          type: 'State', id: 'singleState', value: {
            type: "BooleanLiteral", value: true
          }
        },
        {
          type: 'StateGroup',
          states: [
            {
              type: "State", id: 'groupState1', value: {
                type: "NumberLiteral", value: 1, raw: "1"
              }
            },
            { type: "State", id: 'groupState2', value: { type: "StringLiteral", value: "test" } }
          ]
        }
      ]
    }]);
  });

  it('should handle empty @state group', () => {
    const code = `
          @component EmptyStateComponent {
            @state {}
          }
        `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'EmptyStateComponent',
      body: [{
        type: 'StateGroup',
        states: []
      }]
    }]);
  });

  it('should handle @state with mixed data types', () => {
    const code = `
          @component MixedDataComponent {
            @state {
              numberState: 100;
              stringState: "Hello";
              booleanState: true;
            }
          }
        `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'MixedDataComponent',
      body: [{
        type: 'StateGroup',
        states: [
          {
            type: "State", id: 'numberState', value: {
              type: "NumberLiteral", value: 100, raw: "100"
            }
          },
          {
            type: "State", id: 'stringState', value: {
              type: "StringLiteral", value: "Hello"
            }
          },
          {
            type: "State", id: 'booleanState', value: {
              type: "BooleanLiteral", value: true
            }
          }
        ]
      }]
    }]);
  });

  it('should handle @state with nested empty groups', () => {
    const code = `
          @component NestedEmptyGroupsComponent {
            @state {
              outerGroup: {
                innerGroup: {};
              };
            }
          }
        `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'NestedEmptyGroupsComponent',
      body: [{
        type: 'StateGroup',
        states: [{
          type: "State",
          id: 'outerGroup',
          value: {
            type: "StateGroup",
            states: [{
              type: "State",
              id: 'innerGroup',
              value: {
                type: "StateGroup",
                states: []
              }
            }]
          }
        }]
      }]
    }]);
  });
});

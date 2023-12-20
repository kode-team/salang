import { describe, it, expect } from 'vitest';
import salangParser from "../src/language/salang";

describe('SaLang @event Parsing Tests', () => {
  it('should correctly parse @event with selector', () => {
    const code = `
      @component MyComponent {
        @event click on .button {
          @js { console.log('Button clicked'); }
        }
      }
    `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'MyComponent',
      body: [{
        type: 'Event',
        eventType: 'click',
        selector: '.button',
        args: [],
        body: [
          {
            type: "JavaScript",
            code: [
              { type: "JavaScriptCodeChunk", value: "console.log('Button clicked');" }
            ]
          }
        ]
      }]
    }]);
  });

  it('should correctly parse @event without selector', () => {
    const code = `
      @component MyComponent {
        @event mouseover {
          @js { console.log('Mouseover event'); }
        }
      }
    `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'MyComponent',
      body: [{
        type: 'Event',
        eventType: 'mouseover',
        args: [],
        selector: null, // Selector is optional
        body: [
          {
            type: "JavaScript",
            code: [
              { type: "JavaScriptCodeChunk", value: "console.log('Mouseover event');" }
            ]
          }
        ]
      }]
    }]);
  });

  it('should correctly parse @event with descendant selector', () => {
    const code = `
      @component DescendantComponent {
        @event click on .container .button {
          @js { console.log('Descendant selector clicked'); }
        }
      }
    `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'DescendantComponent',
      body: [{
        type: 'Event',
        eventType: 'click',
        selector: '.container .button',
        args: [],
        body: [
          {
            type: "JavaScript",
            code: [
              { type: "JavaScriptCodeChunk", value: "console.log('Descendant selector clicked');" }
            ]
          }
        ]
      }]
    }]);
  });

  it('should correctly parse @event with child combinator selector', () => {
    const code = `
      @component ChildCombinatorComponent {
        @event mouseover on .list > .list-item {
          @js { console.log('Child combinator selector mouseover'); }
        }
      }
    `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'ChildCombinatorComponent',
      body: [{
        type: 'Event',
        eventType: 'mouseover',
        selector: '.list > .list-item',
        args: [],
        body: [
          {
            type: "JavaScript",
            code: [
              { type: "JavaScriptCodeChunk", value: "console.log('Child combinator selector mouseover');" }
            ]
          }
        ],
      }]
    }]);
  });

  it('should correctly parse @event with ID selector', () => {
    const code = `
      @component IdSelectorComponent {
        @event click on #myButton {
          @js { console.log('Button with ID clicked'); }
        }
      }
    `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'IdSelectorComponent',
      body: [{
        type: 'Event',
        eventType: 'click',
        selector: '#myButton',
        args: [],
        body: [
          {
            type: "JavaScript",
            code: [
              { type: "JavaScriptCodeChunk", value: "console.log('Button with ID clicked');" }
            ]
          }
        ]
      }]
    }]);
  });

  it('should correctly parse @event with combination of class selectors', () => {
    const code = `
      @component ClassCombinationComponent {
        @event mouseover on .parent .child {
          @js { console.log('Child in parent mouseover'); }
        }
      }
    `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'ClassCombinationComponent',
      body: [{
        type: 'Event',
        eventType: 'mouseover',
        selector: '.parent .child',
        args: [],
        body: [
          {
            type: "JavaScript",
            code: [
              { type: "JavaScriptCodeChunk", value: "console.log('Child in parent mouseover');" }
            ]
          }
        ]
      }]
    }]);
  });

  it('should correctly parse @event with direct child selector', () => {
    const code = `
      @component DirectChildComponent {
        @event click on .parent > .direct-child {
          @js { console.log('Direct child clicked'); }
        }
      }
    `;
    const result = salangParser.parse(code);
    expect(result).toEqual([{
      type: 'Component',
      id: 'DirectChildComponent',
      body: [{
        type: 'Event',
        eventType: 'click',
        selector: '.parent > .direct-child',
        args: [],
        body: [
          {
            type: "JavaScript",
            code: [
              { type: "JavaScriptCodeChunk", value: "console.log('Direct child clicked');" }
            ]
          }
        ]
      }]
    }]);
  });
});

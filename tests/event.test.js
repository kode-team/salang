// tests/salangParser.test.js
import { describe, it, expect } from "vitest";
import salangParser from "../src/language/salang";

describe("SaLang Parser - Event Parsing with Optional Event Args", () => {
  it("should parse an event with event args", () => {
    const input = `
      @component eventComponentWithArgs {
        @event click(event) {
          @selector .button {
            background-color: green;
          }
          @js {
            console.log("Clicked", event);
          }
        }
      }
    `;
    const result = salangParser.parse(input.trim());
    expect(result).toEqual([
      {
        type: "Component",
        id: "eventComponentWithArgs",
        body: [
          {
            type: "Event",
            eventName: "click",
            args: ["event"],
            body: [
              {
                type: "CSSRule",
                selector: ".button",
                properties: [
                  { type: "CSSProperty", property: "background-color", value: "green" }
                ]
              },
              {
                type: "JavaScript",
                code: [
                  { type: "JavaScriptCodeChunk", value: "console.log(\"Clicked\", event);" },
                ]
              }
            ]
          }
        ]
      }
    ]);
  });

  it("should parse an event without event args", () => {
    const input = `
      @component eventComponentWithoutArgs {
        @event mouseover {
          @selector .button {
            background-color: blue;
          }
          @js {
            console.log("Mouseover on button");
          }
        }
      }
    `;
    const result = salangParser.parse(input.trim());
    expect(result).toEqual([
      {
        type: "Component",
        id: "eventComponentWithoutArgs",
        body: [
          {
            type: "Event",
            eventName: "mouseover",
            args: [],
            body: [
              {
                type: "CSSRule",
                selector: ".button",
                properties: [
                  { type: "CSSProperty", property: "background-color", value: "blue" }
                ]
              },
              {
                type: "JavaScript",
                code: [
                  { type: "JavaScriptCodeChunk", value: "console.log(\"Mouseover on button\");" },
                ]
              }
            ]
          }
        ]
      }
    ]);
  });

  // 추가적인 복잡한 이벤트 핸들러 시나리오를 위한 테스트 케이스를 계속해서 작성할 수 있습니다.
});

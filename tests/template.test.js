// tests/salandParser.test.js
import { describe, it, expect } from "vitest";
import salandParser from "../src/language/salang";

describe("SaLang Parser Tests", () => {
  it("should parse a simple component correctly", () => {
    const input = `
      @component myComponent {}
    `;
    const result = salandParser.parse(input.trim());

    expect(result).toEqual([
      {
        type: "Component",
        id: "myComponent",
        body: [
        ],
      },
    ]);
  });

});

// tests/salangParser.test.js
import { describe, it, expect } from "vitest";
import * as salangParser from "../../src/language/salang2";



describe("SaLang Parser - Component Parsing", () => {
  it("should parse a basic component with no attributes or content", () => {

    const input = `
      @component emptyComponent {
        @template  {
          @for (item, index) in items {
            <div>my item: <span>{item}: {index+1}</span></div>
          }
        }
      }
    `;

    const result = salangParser.parse(input);
    expect(result).toEqual([
      {
        type: "ComponentDefinition",
        name: {
          type: "Identifier",
          value: "emptyComponent",
        },
        body: [
          {
            type: "TemplateDeclaration",
            elements: [
              {
                type: "ForStatement",
                "item": {
                  "type": "Identifier",
                  "value": "item"
                },
                "index": {
                  "type": "Identifier",
                  "value": "index"
                },
                "collection": {
                  "type": "Text",
                  "value": "items "
                },
                body: [
                  {
                    type: "Element",
                    "name": {
                      "type": "Identifier",
                      "value": "div"
                    },
                    attributes: [],
                    children: [
                      { type: "Text", value: "my item: " },
                      {
                        "type": "Element",
                        "name": {
                          "type": "Identifier",
                          "value": "span"
                        },
                        "attributes": [],
                        "children": [
                          {
                            "type": "Expression",
                            "body": "item"
                          },
                          {
                            "type": "Text",
                            "value": ": "
                          },
                          {
                            "type": "Expression",
                            "body": "index+1"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
      }
    ]);


  });

  // it("should parse a component with attributes", () => {
  //   const input = `
  //     @component myComponent {
  //       @attribute title: "Test Component";
  //     }
  //   `;
  //   const result = salangParser.parse(input.trim());
  //   expect(result).toEqual([
  //     {
  //       type: "Component",
  //       id: "myComponent",
  //       body: [
  //         {
  //           type: "Attribute",
  //           id: "title",
  //           value: {
  //             type: "StringLiteral",
  //             value: "Test Component"
  //           }
  //         }
  //       ]
  //     }
  //   ]);
  // });

  // it("should parse a component with nested elements", () => {
  //   const input = `
  //     @component nestedComponent {
  //       @template {
  //         div {
  //           "Hello World"
  //           "yellow"
  //           "blue"
  //           "red"
  //           span { 
  //             "This is a test"
  //           }
  //         }
  //       }
  //     }
  //   `;
  //   const result = salangParser.parse(input.trim());
  //   expect(result).toEqual([
  //     {
  //       type: "Component",
  //       id: "nestedComponent",
  //       body: [
  //         {
  //           type: "Template",
  //           content: [
  //             {
  //               type: "Element",
  //               tag: "div",
  //               attributes: [],
  //               content: [
  //                 { type: "TextNode", value: "Hello World" },
  //                 { type: "TextNode", value: "yellow" },
  //                 { type: "TextNode", value: "blue" },
  //                 { type: "TextNode", value: "red" },
  //                 {
  //                   type: "Element",
  //                   tag: "span",
  //                   attributes: [],
  //                   content: [{ type: "TextNode", value: "This is a test" }]

  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]);
  // });

  // // 여기에 추가 테스트 케이스를 계속 작성할 수 있습니다.
});

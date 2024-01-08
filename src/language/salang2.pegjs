// SaLang PEG Grammar
// ==================
//
// This is a PEG grammar for SaLang. It is used to generate a parser for SaLang.
//
// The grammar is written in a language called PEG.js. It is a superset of JavaScript.
// You can learn more about PEG.js at https://pegjs.org.
//
// The grammar is written in a way that is easy to understand. It is not optimized for
// performance. The generated parser is fast enough for most use cases.
//



{
  // Helper functions

    // Helper function to remove whitespace nodes
  function filterWhitespace(nodes) {
    return nodes.filter(node => {
      if (typeof node === 'string') return node.trim() !== '';
      return node;
    });
  }


  // Returns the current location of the parser.
  const trackLocation = (node) => {
    return {
      ...node,
      // location: location(),
    };
  }

  console.log("Parsing SaLang code...");
}

Start
  = components:(_ ComponentDefinition _)* { 
    return filterWhitespace(components.flat(Infinity)); 
  }

ComponentDefinition
  = "@component" _ name:Identifier _ "{" _ body:ComponentBody _ "}" {
    return trackLocation({
      type: "ComponentDefinition",
      name,
      body,
    });
  }

ComponentBody
  = content:(_ ComponentContent _)* {
      return filterWhitespace(content.flat(Infinity));
    }

ComponentContent
  = StateDeclaration
  / PropDeclaration
  / OnEventDeclaration
  / TemplateDeclaration
  / FunctionDeclaration
  / StyleDeclaration

StateDeclaration
  = "@state" _ "{" _ properties:(KeyValue (";" _ KeyValue)*)? _ "}" {
    return trackLocation({
      type: "StateDeclaration",
      properties,
    });
  }

KeyValue
  = key:Identifier _ "=" _ value:Value {
    return trackLocation({
      type: "KeyValue",
      key,
      value,
    });
  }

PropDeclaration
  = "@prop" _ name:Identifier ":" _ value:Value ";" _ {
    return trackLocation({
      type: "PropDeclaration",
      name,
      value,
    });
  }

OnEventDeclaration
  = "@on" _ name:Identifier _ "{" _ code:JavaScriptCode _ "}" _ {
    return trackLocation({
      type: "OnEventDeclaration",
      name,
      code,
    });
  }

TemplateDeclaration
  = "@template" _ "{" _ elements:(_ TemplateElement _)* _ "}" {
    return trackLocation({
      type: "TemplateDeclaration",
      elements: filterWhitespace(elements.flat(Infinity)),
    });
  }

TemplateElement
  = InlineTag
  / ContainerTag
  / ControlFlow
  / Expression  
  / Text

InlineTag
  = "<" name:Identifier attributes:(Attribute)* " />" {
      return trackLocation({
        type: "Element",
        name,
        attributes,
      });
    }

ContainerTag
  = "<" name:Identifier attributes:(Attribute)* ">" _ children:(_ TemplateElement _)* _ "</" name2:Identifier ">" {
      if (name.value !== name2.value) {
        error("Tag names do not match");
      }
      return trackLocation({
        type: "Element",
        name,
        attributes,
        children: filterWhitespace(children.flat(Infinity)),
      });
    }
  

  Attribute
    = name:Identifier "=" value:Value {
      return trackLocation({
        type: "Attribute",
        name,
        value,
      });
    }

Expression
  = "{" _ body:ExpressionBody _ "}" {
      return trackLocation({
        type: "Expression",
        body: body.value
      });
    }


ExpressionBody
  = Text

Text
  = [^{}<>]+ {
    return trackLocation({
      type: "Text",
      value: text(),
    });
  }

Identifier
  = [a-zA-Z_] [a-zA-Z_0-9]* {
    return trackLocation({
      type: "Identifier",
      value: text(),
    });
  }

ControlFlow
  = IfStatement
  / ForStatement
  / SwitchStatement
  / WhileStatement

ForStatement
  = "@for" _ item:Identifier _ "in" _ collection:ExpressionBody _ "{" _ body:(_ TemplateElement _)* _ "}" {
      return trackLocation({
        type: "ForStatement",
        item,
        collection,
        body: filterWhitespace(body.flat(Infinity)),
      });
    }
  / "@for" _ "(" _ item:Identifier _ "," _ index:Identifier _ ")" _ "in" _ collection:ExpressionBody _ "{" _ body:(_ TemplateElement _)* _ "}" {
      return trackLocation({
        type: "ForStatement",
        item,
        index,
        collection,
        body: filterWhitespace(body.flat(Infinity)),
      });
    }

IfStatement
  = "@if" _ "(" _ test:Expression _ ")" _ "{" _ ifContent:(TemplateElement)* _ "}"
    ("@else" _ "{" _ elseContent:(TemplateElement)* _ "}")? {
    return trackLocation({
      type: "IfStatement",
      test,
      ifContent,
      elseContent,
    });
  }

SwitchStatement
  = "@switch" _ discriminant:Expression _ "{" _ cases:(CaseClause)* _ "}" {
    return trackLocation({
      type: "SwitchStatement",
      discriminant,
      cases,
    });
  }

CaseClause
  = "@case" _ test:StringLiteral _ "{" _ consequent:(TemplateElement)* _ "}" {
    return trackLocation({
      type: "CaseClause",
      test,
      consequent,
    });
  }
  / "@default" _ "{" _ consequent:(TemplateElement)* _ "}" {
    return trackLocation({
      type: "CaseClause",
      test: null,
      default: true,
      consequent,
    });
  }

WhileStatement
  = "@while" _ "(" _ test:Expression _ ")" _ "{" _ body:(TemplateElement)* _ "}" {
    return trackLocation({
      type: "WhileStatement",
      test,
      body,
    });
  }

FunctionDeclaration
  = "@function" _ name:Identifier _ "(" _ params:(ParameterList)? _ ")" _ "{" _ body:JavaScriptCode _ "}" {
    return trackLocation({
      type: "FunctionDeclaration",
      name,
      params,
      body,
    });
  }


JavaScriptCode
  = "{" _ JavaScriptCodeBlock _ "}" {
    return trackLocation({
      type: "JavaScriptCode",
      code: text(),
    });
  }

JavaScriptCodeBlock
  = body: (Comment / CodeLine) {
    return trackLocation({
      type: "JavaScriptCodeBlock",
      code: body,
    });
  }

CodeLine
  = (!("}" / "\n" / "\r") .)* {
    return trackLocation({
      type: "CodeLine",
      code: text(),
    });
  }

Comment
  = "//" (!"\n" .)* { 
    return trackLocation({
        type: "InlineComment",
        value: text(),
      }); 
    }
  / "/*" (!"*/" .)* "*/" {
    return trackLocation({
        type: "MultiLineComment",
        value: text(),
      }); 
    }

ParameterList
  = params:(Identifier ("," _ Identifier)*) {
    return trackLocation({
      type: "ParameterList",
      params,
    });
  }

StyleDeclaration
  = "@style" _ "{" _ (StyleBody / CSSRules) _ "}" {
    return trackLocation({
      type: "StyleDeclaration",
      body: StyleBody,
    });
  }

StyleBody
  = (StyleRule (";" _ StyleRule)*)? ";" {
    return trackLocation({
      type: "StyleBody",
      rules: StyleRule,
    });
  }

StyleRule
  = Selector _ "{" _ (Declaration (";" _ Declaration)*)? _ "}" {
    return trackLocation({
      type: "StyleRule",
      selector: Selector,
      declarations: Declaration,
    });
  }

Selector
  = CSSSelector {
    return trackLocation({
      type: "Selector",
      value: CSSSelector,
    });
  }

Declaration
  = Property ":" _ PropertyValue {
    return trackLocation({
      type: "Declaration",
      property: Property,
      value: PropertyValue,
    });
  }

Property
  = Identifier

PropertyValue
  = StringLiteral
  / NumberLiteral
  / ColorLiteral

ColorLiteral
  = "#" [0-9a-fA-F]{3,6}

// CSS 선택자 규칙
CSSSelector
  = (Identifier (_ ">" _)?)+
  / "@" (MediaRule / SupportsRule)

MediaRule
  = "media" _ "(" MediaQueryList ")" _ "{" _ (StyleRule (";" _ StyleRule)*)? _ "}" {
    return trackLocation({
      type: "MediaRule",
      media: MediaQueryList,
      rules: StyleRule,
    });
  }

MediaQueryList
  = MediaQuery ("," _ MediaQuery)* {
    return trackLocation({
      type: "MediaQueryList",
      queries: MediaQuery,
    });
  }

MediaQuery
  = "(" _ (MediaType / "not" _ MediaType / "only" _ MediaType) (_ "and" _ MediaFeature)? _ ")" {
    return trackLocation({
      type: "MediaQuery",
      type: MediaType,
      feature: MediaFeature,
    });
  }

MediaType
  = "all" / "print" / "screen" / "speech" {
    return trackLocation({
      type: "MediaType",
      value: text(),
    });
  }

MediaFeature
  = Identifier _ ":" _ (Value / Identifier) {
    return trackLocation({
      type: "MediaFeature",
      name: Identifier,
      value: Value,
    });
  }

SupportsRule
  = "supports" _ "(" Condition ")" _ "{" _ (StyleRule (";" _ StyleRule)*)? _ "}" {
    return trackLocation({
      type: "SupportsRule",
      condition: Condition,
      rules: StyleRule,
    });
  }

Condition
  = (MediaCondition / DeclarationCondition)

MediaCondition
  = "(" _ MediaQueryList _ ")"

DeclarationCondition
  = "(" _ Declaration _ ")"

// 기타 CSS 규칙
CSSRules
  = (AtRule / StyleRule) (";" _ (AtRule / StyleRule)*)?

AtRule
  = "@" (FontFaceRule / KeyframesRule / CustomPropertyRule / PageRule / MediaRule / SupportsRule / ...)

FontFaceRule
  = "font-face" _ "{" _ (Declaration (";" _ Declaration)*)? _ "}" {
    return trackLocation({
      type: "FontFaceRule",
      declarations: Declaration,
    });
  }

KeyframesRule
  = ("keyframes" / "from" / "to" / Percentage) _ AnimationName _ "{" _ (Keyframe (";" _ Keyframe)*)? _ "}" {
    return trackLocation({
      type: "KeyframesRule",
      name: AnimationName,
      keyframes: Keyframe,
    });
  }

AnimationName
    = Identifier

Percentage
  = NumberLiteral "%"

Keyframe
  = (Percentage / "from" / "to") _ "{" _ (Declaration (";" _ Declaration)*)? _ "}" {
    return trackLocation({
      type: "Keyframe",
      value: Percentage,
      declarations: Declaration,
    });
  }

CustomPropertyRule
  = Identifier _ "{" _ (Declaration (";" _ Declaration)*)? _ "}" {
    return trackLocation({
      type: "CustomPropertyRule",
      name: Identifier,
      declarations: Declaration,
    });
  }

PageRule
  = "page" _ "{" _ (Declaration (";" _ Declaration)*)? _ "}" {
    return trackLocation({
      type: "PageRule",
      declarations: Declaration,
    });
  }

_ = [ \t\n\r]*
__ = [ \t\n\r]+

Value
  = StringLiteral
  / NumberLiteral
  / BooleanLiteral
  / Identifier
  / Expression
  / ArrayLiteral
  / ObjectLiteral


Literal
  = NumberLiteral
  / StringLiteral
  / BooleanLiteral
  / ArrayLiteral
  / ObjectLiteral
  / NullLiteral  
  / UndefinedLiteral

UndefinedLiteral
  = "undefined" {
    return trackLocation({
      type: "UndefinedLiteral",
      value: undefined,
    });
  }

NullLiteral
  = "null" {
    return trackLocation({
      type: "NullLiteral",
      value: null
    });
  }

StringLiteral
  = "\"" (("\\\"" / [^\"])* ) "\"" {
    return trackLocation({
      type: "StringLiteral",
      value: text(),
    });
  }

NumberLiteral
  = (IntegerLiteral / FloatingPointLiteral) {
    return trackLocation({
      type: "NumberLiteral",
      value: parseFloat(text()), // Convert text to a numeric value
    });
  }

IntegerLiteral
  = [0-9]+

FloatingPointLiteral
  = [0-9]+ "." [0-9]+

BooleanLiteral
  = "true" {
    return trackLocation({
      type: "BooleanLiteral",
      value: true,
    });
  }
  / "false" {
    return trackLocation({
      type: "BooleanLiteral",
      value: false,
    });
  }

ArrayLiteral
  = "[" _ ArrayLiteralValue? _ "]" {
    return trackLocation({
      type: "ArrayLiteral",
      elements: ArrayLiteralValue,
    });
  }

ArrayLiteralValue
  = Value _ ("," _ Value)*

ObjectLiteral
  = "{" _ ObjectLiteralValue? _ "}" {
    return trackLocation({
      type: "ObjectLiteral",
      properties: ObjectLiteralValue,
    });
  }

ObjectLiteralValue
  = KeyValue _ ("," _ KeyValue)*

Operator = "+" / "-" / "*" / "/"  // Add more operators as needed

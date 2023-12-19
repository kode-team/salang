{
  // Helper function to remove whitespace nodes
  function filterWhitespace(nodes) {
    return nodes.filter(node => {
      if (typeof node === 'string') return node.trim() !== '';
      return node;
    });
  }

  // Helper function to create a text node
  function createTextNode(text) {
    return { type: 'TextNode', value: text.trim() };
  }
}

// The entry point of the grammar
Start
  = components:Component+ { return components; }

// Defines a component
Component
  = "@component" _ id:identifier _ "{" _ body:ComponentBody _ "}" {
      return { type: "Component", id, body };
    }

// Body of a component, can contain various types of content
ComponentBody
  = content:(_ Attribute _ / _ Event _ / _ Style _ / _ Function _ / _ Template _)* {
      return filterWhitespace(content.flat(Infinity));
    }

// Defines an attribute of a component
Attribute
  = "@attribute" _ id:identifier ":" _ value:attributeValue _ ";" {
      return { type: "Attribute", id, value };
    }

// Possible values for an attribute
attributeValue
  = StringLiteral / NumberLiteral / BooleanLiteral / identifier

// Defines an event handler
Event
  = "@event" _ eventName:identifier _ eventArgs:EventArgs? _ "{" _ eventBody:EventBody _ "}" {
      return { type: "Event", eventName, args: eventArgs || [], body: eventBody };
    }

// Event arguments
EventArgs
  = "(" _ argList:identifierList _ ")" {
      return argList;
    }

// List of identifiers, used for event arguments
identifierList
  = first:identifier _ rest:("," _ identifier)* {
      return [first, ...rest.map(r => r[2])];
    }

// Body of an event, can contain selectors and JavaScript sections
EventBody
  = sections:(_ SelectorRule _ / _ JavaScriptSection _)* {
      return filterWhitespace(sections.flat(Infinity));
    }

// JavaScript code section within an event
JavaScriptSection
  = "@js" _ "{" _ code:JavaScriptCode _ "}" {
      return { type: "JavaScript", code };
    }

// JavaScript code, can be a mix of text and variables
JavaScriptCode
  = code:(_ JavaScriptCodeChunk _)* {
      return filterWhitespace(code.flat(Infinity)).map(it => {
        if (typeof it === 'string') return { type: 'JavaScriptCodeChunk', value: it.trim() };
        return it;
      });
    }

// Chunk of JavaScript code, either a variable or plain text
JavaScriptCodeChunk
  = Variable / NonVariableChunk

// Plain text chunk within JavaScript code
NonVariableChunk
  = chars:[^{}]+ {
      return chars.join('');
    }

// Selector rule within an event or function
SelectorRule
  = "@selector" _ selector:selector _ "{" _ properties:CSSPropertiesWithVars _ "}" {
      return { type: "CSSRule", selector, properties };
    }

// CSS properties, allowing variables
CSSPropertiesWithVars
  = properties:(_ CSSPropertyWithVar _ / _ CSSProperty _)* {
      return filterWhitespace(properties.flat(Infinity));
    }

// CSS property that includes a variable
CSSPropertyWithVar
  = property:property _ ":" _ value:Variable _ ";" {
      return { type: "CSSPropertyWithVar", property, value };
    }

// Variable within CSS or JavaScript
Variable
  = "var(" _ varName:identifier _ ")" {
      return { type: "Variable", varName };
    }

// Defines a function
Function
  = "@function" _ functionName:identifier _ functionArgs:FunctionArgs? _ "{" _ functionBody:FunctionBody _ "}" {
      return { type: "Function", functionName, args: functionArgs ? functionArgs : [], body: functionBody };
    }

// Arguments of a function
FunctionArgs
  = "(" _ argList:identifierList _ ")" {
      return argList;
    }

// Body of a function, can contain selectors and JavaScript sections
FunctionBody
  = sections:( _ SelectorRule _ / _ JavaScriptSection _)* {
      return filterWhitespace(sections.flat(Infinity));
    }

// Defines CSS styles
Style
  = "@style" _ "{" _ rules:CSSRules _ "}" {
      return { type: "Style", rules };
    }

// Template of a component
Template
  = "@template" _ "{" _ content:TemplateContent _ "}" {
      return { type: "Template", content: filterWhitespace(content.flat(Infinity)) };
    }

// Content of a template, including conditional rendering, repeat rendering, elements, and text
TemplateContent
  = elements:(_ ConditionalRendering _ / _ RepeatRendering _ / _ Element _ / _ Text _ )* { 
    return filterWhitespace(elements.flat(Infinity)); 
}

// Conditional rendering rules
ConditionalRendering
  = _ ifContent:IfConditionalRendering _ elseContent:ElseConditionalRendering? _  {
      return { type: "Conditional", ifContent, elseContent };
    }

// 'If' part of conditional rendering
IfConditionalRendering
  = "@if" _ condition:JavaScriptCode _ "{" _ content:TemplateContent _ "}" {
      return { type: "IfConditional", condition, content };
    }

// 'Else' part of conditional rendering
ElseConditionalRendering
  = "@else" _ "{" _ content:TemplateContent _ "}" {
      return { type: "ElseConditional", content };
    }    

// Repeat rendering rule
RepeatRendering
  = "@repeat" _ variable:identifier _ "in" _ collection:JavaScriptCode _ "{" _ content:TemplateContent _ "}" {
      return { type: "Repeat", variable, collection, content };
    }

// HTML element
Element
  = tag:TagName _ "{" _ content:(_ Element _ / _ Text _)* _ "}" {
      return { type: "Element", tag, content: filterWhitespace(content.flat(Infinity)) };
    }

// Tag name of an HTML element
TagName
  = id:identifier { return id; }

// Text node
Text
  = chars: [^{}\n]+ { return createTextNode(chars.join('')); }  

// CSS rules
CSSRules
  = rules:CSSRule* { return rules; }

// Single CSS rule
CSSRule
  = selector:selector _ "{" _ properties:CSSProperties _ "}" {
      return { type: "CSSRule", selector, properties };
    }

// CSS properties
CSSProperties
  = properties:CSSProperty* { return properties; }

// Single CSS property
CSSProperty
  = property:property _ ":" _ value:value _ ";" {
      return { type: "CSSProperty", property, value };
    }

// Whitespace
_ "whitespace"
  = [ \t\n\r]*

// Identifier (includes complex identifiers with dot notation)
identifier "identifier"
  = head:[a-zA-Z_] tail:[a-zA-Z0-9_.]* { return head + tail.join(''); }

// String literal
StringLiteral "string"
  = DoubleQuotedString / SingleQuotedString / BacktickQuotedString / TripleDoubleQuotedString
  
DoubleQuotedString "double quoted string"  
  = "\"" chars:[^\"]* "\"" { return chars.join(''); }

SingleQuotedString "single quoted string"
  = "'" chars:[^']* "'" { return chars.join(''); }

BacktickQuotedString "backtick quoted string"
  = '`' chars:[^`]* '`' { return chars.join(''); }

TripleDoubleQuotedString "triple double quoted string"
  = '"""' chars:(TripleDoubleQuotedChar*) '"""' { return chars.join(''); }

TripleDoubleQuotedChar
  = !'"""' char:. { return char; }

// Number literal
NumberLiteral "NumberLiteral"
  = digits:[0-9]+ { return parseInt(digits.join('')); }

// Boolean literal
BooleanLiteral "BooleanLiteral"
  = "true" { return true; }
  / "false" { return false; }

// CSS selector
selector "CSS selector"
  = chars:[^{]+ { return chars.join('').trim(); }

// CSS property
property "CSS property"
  = chars:[^:]+ { return chars.join('').trim(); }

// CSS value
value "CSS value"
  = chars:[^;]+ { return chars.join('').trim(); }

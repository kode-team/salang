{
  // Helper function to remove whitespace nodes
  function filterWhitespace(nodes) {
    return nodes.filter(node => {
      if (typeof node === 'string') return node.trim() !== '';
      return node;
    });
  }

  // Helper function to create a text node
  function createTextNode(text, trim = true) {
    return { type: 'TextNode', value: trim ? text.trim() : text };
  }

  // split the content of a component into attributes and body content
  function splitClassIdBody(content, attributes, classSelectors) {
     const list = filterWhitespace(content.flat(Infinity));
      let bodyContent = list.filter(it => it.type !== 'Attribute');
      const attributeContent = list.filter(it => it.type === 'Attribute');
      const combinedAttributes = [
        ...(attributes || []),
        ...(classSelectors || []),
        ...(attributeContent || [])
      ];

      // combine class selectors
      const classOnlySelectors = combinedAttributes.filter(it => it.type === 'Attribute' && it.id === 'class');
      const totalAttributes = combinedAttributes.filter(it => it.type === 'Attribute' && it.id !== 'class');
      if (classOnlySelectors.length > 0) {
        // DO NOT JOIN CLASS SELECTORS
        const combinedClassSelectors = classOnlySelectors.map(it => it.value);
        totalAttributes.push({ type: 'Attribute', id: 'class', value: combinedClassSelectors });
      }

      bodyContent = bodyContent.map(it => {
        if (typeof it === 'string') return createTextNode(it, false);
        if (it.type === 'StringLiteral') return createTextNode(it.value, false);
        return it;
      });

    return {
      attributes: totalAttributes,
      content: bodyContent
    }
  }
}

// The entry point of the grammar
Start
  = components:(_ Component _)* { 
    return filterWhitespace(components.flat(Infinity)); 
  }

// Defines a component
Component
  = "@component" _ id:identifier _ "{" _ body:ComponentBody _ "}" {
      return { type: "Component", id, body };
    }

// Body of a component, can contain various types of content
ComponentBody
  = content:(_ ComponentContent _)* {
      return filterWhitespace(content.flat(Infinity));
    }

ComponentContent
  =  State / Attribute / ComponentEvent / Event / Style / Function / JsxTemplate / Template

State
  = "@state" _ content:StateContent _ {
      return content;
    }

StateContent
  = StateGroup / StateSingle

StateGroup
  = _ "{" _ states:StateSingle* _ "}" _ {
      return { type: "StateGroup", states };
    }

StateSingle
  = _ id:identifier _ ":" _ value:StateSingleBody _ ";" {
      return { type: "State", id, value };
    }

StateSingleBody 
  = attributeValue / StateGroup

// Defines an attribute of a component
Attribute
  = "@attribute" _ id:identifier ":" _ value:attributeValue _ ";" {
      return { type: "Attribute", id, value };
    }

// Possible values for an attribute
attributeValue
  = StringLiteral / NumberLiteral / BooleanLiteral / Variable / ArrayLiteral / identifier


ComponentEvent
  = "@on" eventType:identifier _ "{" _ eventBody:EventBody _ "}" {
      return { type: "ComponentEvent", eventType, body: eventBody };
    }

// Defines an event handler
Event
  = "@event" _ eventType:identifier _ eventArgs:EventArgs? _ selector:SelectorOptional? _ "{" _ eventBody:EventBody _ "}" {
      return { type: "Event", eventType, args: eventArgs || [], body: eventBody, selector };
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

// Optional selector for an event
SelectorOptional
  = "on" _ selector:selector {
      return selector ? selector : null;
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
  = "var(" _ varName:varIdentifier _ ")" {
      return { type: "Variable", varName };
    }

// Defines a function
Function
  = "@function" _ functionName:identifier _ functionArgs:FunctionArgs? _ "{" _ functionBody:FunctionBody _ "}" {
      return { type: "Function", functionName, args: functionArgs ? functionArgs : [], body: functionBody };
    }

// Arguments of a function
FunctionArgs
  = "(" _ argList:identifierList? _ ")" {
      return argList ? argList : [];
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

JsxTemplate
  = "@jsx" _ name:identifier? _ "{" _ content:JsxElement* _ "}" {
      return { type: "JsxTemplate", name, content: filterWhitespace(content.flat(Infinity)) };
    }    
JsxElement
  = "<" _ tagName:JsxTagName _ attributes:JsxAttributeList? _ ">" _ children:JsxContent* _ "</" _ endTagName:JsxTagName _ ">" {
      return {
        type: "jsxElement",
        tagName,
        attributes: attributes || [],
        children,
      };
    }

JsxContent
  = JsxElement / JsxExpression / JsxText

JsxExpression
  = "{" _ expression:JavaScriptCode _ "}" {
      return { type: "jsxExpression", expression };
    }

JsxText
  = text:[^<]+ {
      return { type: "jsxText", text: text.join("") };
    }

JsxTagName
  = [a-zA-Z][a-zA-Z0-9_.]* { return text(); }

JsxAttributeList
  = attributes:JsxAttribute* { return attributes; }

JsxAttribute
  = _ name:JsxAttributeName _ "=" _ value:JsxAttributeValue {
      return { type: "jsxAttribute", name, value };
    }

JsxAttributeName
  = [a-zA-Z\-]+ { return text(); }

JsxAttributeValue
  = value:(
      JsxDoubleQuotedString
      / JsxSingleQuotedString
      / JsxIdentifier
      / [^"'\s>]+ { return text(); }
    ) {
      return { type:"jsxAttributeValue", value};
    }

JsxIdentifier
  = "{" _ variable:JsxVariable _ "}" {
      return { type: "jsxIdentifier", variable };
    }

JsxVariable
  = [a-zA-Z_][a-zA-Z0-9_.]* { return text(); }

JsxDoubleQuotedString
  = "\"" chars:([^"]*) "\"" {
      return chars.join("");
    }

JsxSingleQuotedString
  = "'" chars:([^']*) "'" {
      return chars.join("");
    }

// Template of a component
Template
  = "@template" _ name:TemplateName? _ "{" _ content:TemplateContent _ "}" {
      return { type: "Template", ...(name ? {name} : {}), content: filterWhitespace(content.flat(Infinity)) };
    }

TemplateName
  = identifier { return text(); }

// Content of a template, including conditional rendering, repeat rendering, elements, and text
TemplateContent
  = elements:( _ TemplateContentWithText _ )* { 
    return filterWhitespace(elements.flat(Infinity)); 
}

TemplateContentWithText
  = StringLiteral / Variable / Attribute / ConditionalRendering / RepeatRendering / JavaScriptSection / Element / Text


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
  = tag:TagName classSelectors:(ClassSelectors/IDSelectors)? attributes:ElementAttributeList? _ "{" _ content:TemplateContent _ "}" {

      const s = splitClassIdBody(content, attributes, classSelectors);

      return { type: "Element", tag, ...s };
    }
  / tag:TagName classSelectors:(ClassSelectors/IDSelectors)? attributes:ElementAttributeList? _ content:InlineElementContent {

      const s = splitClassIdBody(content, attributes, classSelectors);

      return { type: "Element", tag, ...s };

    }

InlineElementContent
  = content:(_ StringLiteral _ / _ Variable _ / Text)* {
      return filterWhitespace(content.flat(Infinity)).map(it => {
        if (typeof it === 'string') return createTextNode(it, false);
        if (it.type === 'StringLiteral') return createTextNode(it.value, false);
        return it;
      });
    }

ClassSelectors
  = selectors:("." classIdentifier:identifier)+ {
      return selectors.map(selector => {
        return { type: "Attribute", id: "class", value: selector[1] }
      });
    }
IDSelectors
  = selectors:("#" classIdentifier:identifier)+ {
      return selectors.map(selector => {
        return { type: "Attribute", id: "id", value: selector[1] };
      });
    }    

ElementAttributeList
  = "(" _ attr:ElementAttribute _ attrs:(',' _ ElementAttribute _)* _ ")" {
      return [attr, ...attrs.map(attr => attr[2])];
    }

ElementAttribute
  = id:("class" / "id" / attributeName) _ ":" _ value:(_ attributeValue _)* {
      return { type: "Attribute", id, value: filterWhitespace(value.flat(Infinity)) };
    }

attributeName "attribute name"
  = chars:[^:]+ { return chars.join('').trim(); }

// Tag name of an HTML element
TagName
  = id:identifier { return id; }

// Text node
Text
  = chars: [^{}\n]+ { return createTextNode(chars.join('')); }  

// CSS rules
CSSRules
  = rules:(_ CSSRule _)* { 
      return filterWhitespace(rules.flat(Infinity)); 
    }

// Single CSS rule
CSSRule
  = selector:selector _ "{" _ properties:CSSProperties _ "}" {
      return { type: "CSSRule", selector, properties };
    }

// CSS properties
CSSProperties
  = properties:(_ CSSProperty _)* { 
    return filterWhitespace(properties.flat(Infinity)); 
  }

// Single CSS property
CSSProperty
  = property:property _ ":" _ value:(Variable / value) _ ";" {
      return { type: "CSSProperty", property, value };
    }

// Whitespace
_ "whitespace"
  = [ \t\n\r]*

// Identifier (includes complex identifiers with dot notation)
identifier "identifier"
  = head:[a-zA-Z_\-] tail:[a-zA-Z0-9_\-]* { return head + tail.join(''); }

// dot notation
varIdentifier "var identifier"
  = head:identifier tail:("." identifier)* { 
    if (tail.length === 0) return head;
    return [head, tail.map(t => t[1])].join('.'); 
  }

// Array literal
ArrayLiteral "array literal"
  = "[" _ elements:ArrayElements? _ "]" {
      return { type: "ArrayLiteral", elements: elements || [] };
    }

ArrayElements
  = first:attributeValue _ rest:(_ "," _ attributeValue _)* {
      return [first, ...rest.map(r => r[3])];
    }


// String literal
StringLiteral "string"
  = DoubleQuotedString / SingleQuotedString / BacktickQuotedString / TripleDoubleQuotedString
  
DoubleQuotedString "double quoted string"
  = "\"" chars:DoubleQuotedChar* "\"" {
      return { type: "StringLiteral",  value: chars.join('')};
    }

DoubleQuotedChar
  = "\\\\" { return "\\"; }  // 이스케이프된 백슬래시
  / "\\\"" { return "\""; }  // 이스케이프된 따옴표
  / [^\\"]                    // 백슬래시와 따옴표를 제외한 모든 문자


SingleQuotedString "single quoted string"
  = "'" chars:[^']* "'" { 
      return { type: "StringLiteral",  value: chars.join('')};
  }

BacktickQuotedString "backtick quoted string"
  = '`' chars:[^`]* '`' { 
      return { type: "StringLiteral",  value: chars.join('')};
  }

TripleDoubleQuotedString "triple double quoted string"
  = '"""' chars:(TripleDoubleQuotedChar*) '"""' { 
      return { type: "StringLiteral",  value: chars.join('')};
  }

TripleDoubleQuotedChar
  = !'"""' char:. { return char; }

// Number literal
NumberLiteral "NumberLiteral"
  = digits:[0-9]+ decimalPart:("." [0-9]+)? exponentPart:("e" [+-]? [0-9]+)? { 
      var numberString = digits.join('') + (decimalPart ? decimalPart.flat(Infinity).join('') : '') + (exponentPart ? exponentPart.flat(Infinity).join('') : '');
      return { type: "NumberLiteral", value: parseFloat(numberString), raw: numberString }; 
    }


// Boolean literal
BooleanLiteral "BooleanLiteral"
  = "true" { 
      return { type: "BooleanLiteral", value: true } 
    }
  / "false" { 
      return { type: "BooleanLiteral", value: false }; 
    }

// CSS selector
selector "CSS selector"
  = chars:[^{]+ { return chars.join('').trim(); }

// CSS property
property "CSS property"
  = chars:[^:;{}]+ { return chars.join('').trim(); }

// CSS value
value "CSS value"
  = chars:[^;{}]+ { return chars.join('').trim(); }

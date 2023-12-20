# SaLang Programming Language

## Introduction

SaLang is a new programming language with unique syntax and features, specifically focused on simplifying the development and management of web components.

## Features

- Component-based architecture
- Concise and clear syntax
- Optimized for web development

## Installation

Instructions to install SaLang language.

```bash

```

## Usage

Basic usage of the SaLang language.

### Basic Structure

#### Components

```css
@component MyComponent {
  // Contents of the component
}
```

#### State Management

```css
@state {
  counter: 0;
  isvisible: true;
}
```

#### Defining Attributes

```css
@attribute title: "Interactive Component";
```

#### Styling Components

```css
@style {
  .my-class {
    color: var(primaryColor);
  }
}
```

#### Event Handling

```css
@event click on .my-button {
  @js {
    // Event handling logic
  }
}
```

#### Templating

```css
@template {
  div.my-component {
    "Hello, world!"
  }
}
```

#### Full Example

```css
@component ComplexComponent {
    @state {
      items: [];
      selectedItem: null;
    }

    @attribute defaultColor: "blue";

    @style {
      .item {
        color: var(defaultColor);
        padding: 10px;
        border: 1px solid black;
      }
      .selected {
        background-color: yellow;
      }
    }

    @function selectItem(itemId) {
      @js {
        this.selectedItem = this.items.find(item => item.id === itemId);
      }
    }

    @event click on .item {
      @js {
        selectItem(var(itemId));
      }
    }

    @template {
      ul {
        @repeat item in var(items) {
          li.item(id: "item-" var(item.id)) {
            "Item: " var(item.name)

          }
        }
      }
    }
}
```

## Contributing

Contributions to SaLang are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

This project is licensed under the [MIT License](LICENSE).

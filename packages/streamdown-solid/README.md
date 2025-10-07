# Streamdown-Solid

A Solid.js drop-in replacement for solid-markdown, designed for AI-powered streaming.

[![npm version](https://img.shields.io/npm/v/streamdown-solid)](https://www.npmjs.com/package/streamdown-solid)

## Overview

Formatting Markdown is easy, but when you tokenize and stream it, new challenges arise. Streamdown-Solid is built specifically to handle the unique requirements of streaming Markdown content from AI models, providing seamless formatting even with incomplete or unterminated Markdown blocks.

Streamdown-Solid powers the [AI Elements Response](https://ai-sdk.dev/elements/components/response) component but can be installed as a standalone package for your own streaming needs.

## Features

- 🚀 **Drop-in replacement** for `solid-markdown`
- 🔄 **Streaming-optimized** - Handles incomplete Markdown gracefully
- 🎨 **Unterminated block parsing** - Styles incomplete bold, italic, code, links, and headings
- 📊 **GitHub Flavored Markdown** - Tables, task lists, and strikethrough support
- 🔢 **Math rendering** - LaTeX equations via KaTeX
- 📈 **Mermaid diagrams** - Render Mermaid diagrams as code blocks with a button to render them
- 🎯 **Code syntax highlighting** - Beautiful code blocks with Shiki
- 🛡️ **Security-first** - Built on secure rendering principles
- ⚡ **Performance optimized** - Memoized rendering for efficient updates
- ⚛️ **Solid.js native** - Built specifically for Solid.js with reactive primitives

## Installation

```bash
bun add streamdown-solid
```

<!-- Then, update your Tailwind `globals.css` to include the following.

```css
@source "../node_modules/streamdown-solid/dist/index.js";
```

Make sure the path matches the location of the `node_modules` folder in your project. This will ensure that the Streamdown styles are applied to your project. -->

## Usage

### Basic Example

```tsx
import { Streamdown } from 'streamdown-solid'

export default function Page() {
  const markdown = '# Hello World\n\nThis is **streaming** markdown!'

  return <Streamdown>{markdown}</Streamdown>
}
```

### Mermaid Diagrams

Streamdown supports Mermaid diagrams using the `mermaid` language identifier:

```tsx
import { Streamdown } from 'streamdown-solid'
import type { MermaidConfig } from 'mermaid'

export default function Page() {
  const markdown = `
# Flowchart Example

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
\`\`\`

# Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant User
    participant API
    participant Database

    User->>API: Request data
    API->>Database: Query
    Database-->>API: Results
    API-->>User: Response
\`\`\`
  `

  // Optional: Customize Mermaid theme and colors
  const mermaidConfig: MermaidConfig = {
    theme: 'dark',
    themeVariables: {
      primaryColor: '#ff0000',
      primaryTextColor: '#fff',
    },
  }

  return <Streamdown mermaidConfig={mermaidConfig}>{markdown}</Streamdown>
}
```

### With AI SDK

```tsx
import { createSignal } from 'solid-js'
import { Streamdown } from 'streamdown-solid'

// Note: AI SDK integration would need to be adapted for Solid.js
// This is a basic example showing the component usage
export default function Page() {
  const [input, setInput] = createSignal('')
  const [messages, setMessages] = createSignal<Array<{ id: string; text: string }>>([])

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const text = input().trim()
    if (text) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), text }])
      setInput('')
    }
  }

  return (
    <>
      <For each={messages()}>{(message) => <Streamdown>{message.text}</Streamdown>}</For>

      <form onSubmit={handleSubmit}>
        <input
          value={input()}
          onInput={(e) => setInput(e.currentTarget.value)}
          placeholder='Say something...'
        />
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}
```

## Props

Streamdown accepts all the same props as solid-markdown, plus additional streaming-specific options:

| Prop                      | Type                                                                | Default                           | Description                                                     |
| ------------------------- | ------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------- |
| `children`                | `string`                                                            | -                                 | The Markdown content to render                                  |
| `parseIncompleteMarkdown` | `boolean`                                                           | `true`                            | Parse and style unterminated Markdown blocks                    |
| `class`                   | `string`                                                            | -                                 | CSS class for the container                                     |
| `components`              | `object`                                                            | -                                 | Custom component overrides                                      |
| `remarkPlugins`           | `array`                                                             | `[remarkGfm, remarkMath]`         | Remark plugins to use                                           |
| `rehypePlugins`           | `array`                                                             | `[rehypeKatex]`                   | Rehype plugins to use                                           |
| `allowedImagePrefixes`    | `array`                                                             | `['*']`                           | Allowed image URL prefixes                                      |
| `allowedLinkPrefixes`     | `array`                                                             | `['*']`                           | Allowed link URL prefixes                                       |
| `defaultOrigin`           | `string`                                                            | -                                 | Default origin to use for relative URLs in links and images     |
| `shikiTheme`              | `[BundledTheme, BundledTheme]`                                      | `['github-light', 'github-dark']` | The light and dark themes to use for code blocks                |
| `mermaidConfig`           | `MermaidConfig`                                                     | -                                 | Custom configuration for Mermaid diagrams (theme, colors, etc.) |
| `controls`                | `boolean \| { table?: boolean, code?: boolean, mermaid?: boolean }` | `true`                            | Control visibility of copy/download buttons                     |

## Architecture

Streamdown is built as a monorepo with:

- **`packages/streamdown`** - The core React component library
- **`apps/website`** - Documentation and demo site

## Development

```bash
# Install dependencies
bun install

# Build the streamdown-solid package
bun run build

# Run development server
bun run dev

# Run tests
bun test

# Build packages
bun run build
```

## Requirements

- Node.js >= 18
- Solid.js >= 1.8.0

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

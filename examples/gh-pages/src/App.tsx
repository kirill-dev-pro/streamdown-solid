import { createMemo, createSignal } from 'solid-js'
import { Streamdown } from 'streamdown-solid'

const sampleMarkdown = `# Streamdown Solid Example

This is a demonstration of the **streamdown-solid** package, a drop-in replacement for solid-markdown designed for AI-powered streaming.

## Features

- **Real-time streaming**: Parse incomplete markdown as it's being generated
- **Syntax highlighting**: Powered by Shiki with multiple themes
- **Math support**: LaTeX math rendering with KaTeX
- **Mermaid diagrams**: Interactive flowcharts and diagrams
- **Table controls**: Copy and download functionality
- **Code controls**: Copy and download code blocks

## Code Example

\`\`\`typescript
import { Streamdown } from 'streamdown-solid'

function MyComponent() {
  return (
    <Streamdown>
      {markdownContent}
    </Streamdown>
  )
}
\`\`\`

## Math Example

Here's some inline math: $E = mc^2$

And a block equation:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## Mermaid Diagram

\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\`

## Table Example

| Feature | Status | Description |
|---------|--------|-------------|
| Streaming | ✅ | Real-time markdown parsing |
| Math | ✅ | LaTeX support |
| Diagrams | ✅ | Mermaid integration |
| Tables | ✅ | Enhanced table controls |

## Incomplete Markdown Test

This demonstrates how streamdown handles incomplete markdown:

- Item 1
- Item 2
- Incomplete item without closing

> This is a blockquote that might be incomplete

\`\`\`javascript
function incomplete() {
  console.log("This code block might be incomplete
\`\`\`

## Controls

You can control which features are enabled:

- **Table controls**: Copy and download buttons
- **Code controls**: Copy and download code blocks  
- **Mermaid controls**: Download diagram functionality

Try editing the markdown content in the textarea below to see real-time updates!`

const incompleteMarkdown = `# Streaming Example

This content is being streamed in real-time:

- First item
- Second item
- Third item that's still being typed...`

export default function App() {
  const [markdown, setMarkdown] = createSignal(sampleMarkdown)
  const [showIncomplete, setShowIncomplete] = createSignal(true)
  const [controls, setControls] = createSignal(true)

  const content = createMemo(() => (showIncomplete() ? incompleteMarkdown : markdown()))

  return (
    <div class='min-h-screen bg-gray-50'>
      <div class='container mx-auto px-4 py-8'>
        <div class='mb-8'>
          <h1 class='text-4xl font-bold text-gray-900 mb-4'>Streamdown Solid Example</h1>
          <p class='text-lg text-gray-600 mb-6'>
            A demonstration of the streamdown-solid package for AI-powered streaming markdown.
          </p>

          <div class='flex gap-4 mb-6'>
            <button
              onClick={() => setShowIncomplete(!showIncomplete())}
              class='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            >
              {showIncomplete() ? 'Show Complete' : 'Show Incomplete Example'}
            </button>
            <button
              onClick={() => setControls(!controls())}
              class='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
            >
              {controls() ? 'Hide Controls' : 'Show Controls'}
            </button>
          </div>
        </div>

        <div class='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div>
            <h2 class='text-2xl font-semibold mb-4'>Markdown Source</h2>
            <textarea
              value={markdown()}
              onInput={(e) => setMarkdown(e.currentTarget.value)}
              class='w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm'
              placeholder='Enter your markdown here...'
            />
          </div>

          <div>
            <h2 class='text-2xl font-semibold mb-4'>Rendered Output</h2>
            <div class='border border-gray-300 rounded-lg p-6 bg-white min-h-96'>
              <Streamdown
                controls={controls()}
                parseIncompleteMarkdown={true}
                children={content()}
              />
              {/* <SolidMarkdown children={showIncomplete() ? incompleteMarkdown : markdown()} /> */}
            </div>
          </div>
        </div>

        <div class='mt-8 p-6 bg-blue-50 rounded-lg'>
          <h3 class='text-lg font-semibold mb-2'>About Streamdown Solid</h3>
          <p class='text-gray-700'>
            This example demonstrates the key features of streamdown-solid: real-time markdown
            parsing, syntax highlighting, math rendering, Mermaid diagrams, and enhanced table/code
            controls. The package is designed to handle incomplete markdown as it's being streamed,
            making it perfect for AI-powered applications.
          </p>
        </div>
      </div>
    </div>
  )
}

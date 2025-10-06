# Streamdown Solid Example

This is a simple Vite + Solid.js application that demonstrates the functionality of the `streamdown-solid` package.

## Features Demonstrated

- **Real-time markdown parsing**: Edit markdown in the textarea and see live updates
- **Incomplete markdown handling**: Toggle between complete and incomplete markdown examples
- **Syntax highlighting**: Code blocks with syntax highlighting powered by Shiki
- **Math rendering**: LaTeX math support with KaTeX
- **Mermaid diagrams**: Interactive flowcharts and diagrams
- **Enhanced controls**: Copy and download functionality for tables and code blocks
- **Responsive design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (or Bun as preferred)
- npm/yarn/pnpm (or Bun)

### Installation

1. Navigate to the examples directory:

   ```bash
   cd src/examples
   ```

2. Install dependencies:

   ```bash
   # Using npm
   npm install

   # Using Bun (recommended)
   bun install
   ```

3. Start the development server:

   ```bash
   # Using npm
   npm run dev

   # Using Bun
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Basic Example

```tsx
import { Streamdown } from 'streamdown-solid'

function MyComponent() {
  return <Streamdown>{markdownContent}</Streamdown>
}
```

### With Controls

```tsx
<Streamdown
  controls={{
    table: true,
    code: true,
    mermaid: true,
  }}
>
  {markdownContent}
</Streamdown>
```

### Incomplete Markdown

```tsx
<Streamdown parseIncompleteMarkdown={true}>{streamingMarkdownContent}</Streamdown>
```

## Example Features

1. **Live Editing**: The left panel contains a textarea where you can edit markdown content and see real-time updates in the right panel.

2. **Incomplete Markdown**: Click the "Show Incomplete Example" button to see how streamdown handles incomplete markdown content.

3. **Controls Toggle**: Use the "Show/Hide Controls" button to toggle the enhanced controls for tables and code blocks.

4. **Interactive Elements**:
   - Copy buttons on code blocks and tables
   - Download functionality for code and diagrams
   - Syntax highlighting for various programming languages
   - Math rendering for LaTeX expressions
   - Mermaid diagram rendering

## Project Structure

```
src/examples/
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── index.html            # HTML template
├── README.md             # This file
└── src/
    ├── main.tsx          # Application entry point
    └── App.tsx           # Main application component
```

## Development

The example app uses:

- **Vite** for fast development and building
- **Solid.js** for reactive UI components
- **Tailwind CSS** for styling
- **KaTeX** for math rendering
- **streamdown-solid** for markdown processing

## Building for Production

```bash
# Using npm
npm run build

# Using Bun
bun run build
```

The built files will be in the `dist` directory.

## Preview Production Build

```bash
# Using npm
npm run preview

# Using Bun
bun run preview
```

This will serve the production build locally for testing.

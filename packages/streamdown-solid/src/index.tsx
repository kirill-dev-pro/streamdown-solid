import { createContext, createMemo } from 'solid-js'
import { SolidMarkdown } from 'solid-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import type { BundledTheme } from 'shiki'
import 'katex/dist/katex.min.css'
import type { MermaidConfig } from 'mermaid'
import type { Options as RemarkGfmOptions } from 'remark-gfm'
import type { Options as RemarkMathOptions } from 'remark-math'
import { components as defaultComponents } from './components'
import { parseMarkdownIntoBlocks } from './parse-blocks'
import { parseIncompleteMarkdown } from './parse-incomplete-markdown'
import { cn } from './utils'

export type { MermaidConfig } from 'mermaid'

type SolidMarkdownProps = {
  defaultOrigin?: string
  allowedLinkPrefixes?: string[]
  allowedImagePrefixes?: string[]
  children?: string
  components?: Record<string, any>
  rehypePlugins?: any[]
  remarkPlugins?: any[]
}

export type ControlsConfig =
  | boolean
  | {
      table?: boolean
      code?: boolean
      mermaid?: boolean
    }

export type StreamdownProps = SolidMarkdownProps & {
  parseIncompleteMarkdown?: boolean
  class?: string
  shikiTheme?: [BundledTheme, BundledTheme]
  mermaidConfig?: MermaidConfig
  controls?: ControlsConfig
}

export const ShikiThemeContext = createContext<[BundledTheme, BundledTheme]>([
  'github-light' as BundledTheme,
  'github-dark' as BundledTheme,
])

export const MermaidConfigContext = createContext<MermaidConfig | undefined>(undefined)

export const ControlsContext = createContext<ControlsConfig>(true)

type BlockProps = SolidMarkdownProps & {
  content: string
  shouldParseIncompleteMarkdown: boolean
}

const remarkMathOptions: RemarkMathOptions = {
  singleDollarTextMath: false,
}

const remarkGfmOptions: RemarkGfmOptions = {}

const Block = (props: BlockProps) => {
  const parsedContent = createMemo(() =>
    typeof props.content === 'string' && props.shouldParseIncompleteMarkdown
      ? parseIncompleteMarkdown(props.content.trim())
      : props.content,
  )

  return <SolidMarkdown children={parsedContent()} />
}

export const Streamdown = (props: StreamdownProps) => {
  const {
    allowedImagePrefixes = ['*'],
    allowedLinkPrefixes = ['*'],
    defaultOrigin,
    parseIncompleteMarkdown: shouldParseIncompleteMarkdown = true,
    components,
    rehypePlugins,
    remarkPlugins,
    class: _class,
    shikiTheme = ['github-light', 'github-dark'],
    mermaidConfig,
    controls = true,
    ...restProps
  } = props

  const blocks = createMemo(() =>
    parseMarkdownIntoBlocks(typeof props.children === 'string' ? props.children : ''),
  )

  const rehypeKatexPlugin = createMemo(() =>
    rehypeKatex({ errorColor: 'var(--color-muted-foreground)' }),
  )

  return (
    <ShikiThemeContext.Provider value={shikiTheme}>
      <MermaidConfigContext.Provider value={mermaidConfig}>
        <ControlsContext.Provider value={controls}>
          <div class={cn('space-y-4', _class)} {...restProps}>
            {blocks().map((block, index) => (
              <Block
                allowedImagePrefixes={allowedImagePrefixes}
                allowedLinkPrefixes={allowedLinkPrefixes}
                components={{
                  ...defaultComponents,
                  ...components,
                }}
                content={block}
                defaultOrigin={defaultOrigin}
                rehypePlugins={[rehypeRaw, rehypeKatexPlugin(), ...(rehypePlugins ?? [])]}
                remarkPlugins={[
                  [remarkGfm, remarkGfmOptions],
                  [remarkMath, remarkMathOptions],
                  ...(remarkPlugins ?? []),
                ]}
                shouldParseIncompleteMarkdown={shouldParseIncompleteMarkdown}
              />
            ))}
          </div>
        </ControlsContext.Provider>
      </MermaidConfigContext.Provider>
    </ShikiThemeContext.Provider>
  )
}

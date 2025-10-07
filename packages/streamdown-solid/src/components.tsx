import { type JSX, useContext, type Component, type ParentProps } from 'solid-js'
import type { BundledLanguage } from 'shiki'
import { ControlsContext, MermaidConfigContext } from './index'
import { CodeBlock, CodeBlockCopyButton, CodeBlockDownloadButton } from './code-block'
import { ImageComponent } from './image'
import { Mermaid } from './mermaid'
import { TableCopyButton, TableDownloadDropdown } from './table'
import { cn } from './utils'

const LANGUAGE_REGEX = /language-([^\s]+)/

type MarkdownPoint = { line?: number; column?: number }
type MarkdownPosition = { start?: MarkdownPoint; end?: MarkdownPoint }
type MarkdownNode = {
  position?: MarkdownPosition
  properties?: { class?: string }
}

type WithNode<T> = T & {
  node?: MarkdownNode
  children?: JSX.Element
  class?: string
}

function sameNodePosition(prev?: MarkdownNode, next?: MarkdownNode): boolean {
  if (!(prev?.position || next?.position)) {
    return true
  }
  if (!(prev?.position && next?.position)) {
    return false
  }

  const prevStart = prev.position.start
  const nextStart = next.position.start
  const prevEnd = prev.position.end
  const nextEnd = next.position.end

  return (
    prevStart?.line === nextStart?.line &&
    prevStart?.column === nextStart?.column &&
    prevEnd?.line === nextEnd?.line &&
    prevEnd?.column === nextEnd?.column
  )
}

// Shared comparators
function sameClassAndNode(
  prev: { class?: string; node?: MarkdownNode },
  next: { class?: string; node?: MarkdownNode },
) {
  return prev.class === next.class && sameNodePosition(prev.node, next.node)
}

const shouldShowControls = (
  config: boolean | { table?: boolean; code?: boolean; mermaid?: boolean },
  type: 'table' | 'code' | 'mermaid',
) => {
  if (typeof config === 'boolean') {
    return config
  }

  return config[type] !== false
}

type OlProps = WithNode<JSX.IntrinsicElements['ol']>
const MemoOl: Component<OlProps> = (props) => (
  <ol
    class={cn('ml-4 list-outside list-decimal whitespace-normal', props.class)}
    data-streamdown='ordered-list'
    {...props}
  >
    {props.children}
  </ol>
)

type LiProps = WithNode<JSX.IntrinsicElements['li']>

const MemoLi: Component<LiProps> = (props) => (
  <li class={cn('py-1', props.class)} data-streamdown='list-item' {...props}>
    {props.children}
  </li>
)

type UlProps = WithNode<JSX.IntrinsicElements['ul']>
const MemoUl: Component<UlProps> = (props) => (
  <ul
    class={cn('ml-4 list-outside list-disc whitespace-normal', props.class)}
    data-streamdown='unordered-list'
    {...props}
  >
    {props.children}
  </ul>
)

type HrProps = WithNode<JSX.IntrinsicElements['hr']>
const MemoHr: Component<HrProps> = (props) => (
  <hr class={cn('my-6 border-border', props.class)} data-streamdown='horizontal-rule' {...props} />
)

type StrongProps = WithNode<JSX.IntrinsicElements['span']>
const MemoStrong: Component<StrongProps> = (props) => (
  <span class={cn('font-semibold', props.class)} data-streamdown='strong' {...props}>
    {props.children}
  </span>
)

type AProps = WithNode<JSX.IntrinsicElements['a']> & { href?: string }
const MemoA: Component<AProps> = (props) => {
  const isIncomplete = props.href === 'streamdown:incomplete-link'

  return (
    <a
      class={cn('wrap-anywhere font-medium text-primary underline', props.class)}
      data-incomplete={isIncomplete}
      data-streamdown='link'
      href={props.href}
      rel='noreferrer'
      target='_blank'
      {...props}
    >
      {props.children}
    </a>
  )
}

type HeadingProps<TTag extends keyof JSX.IntrinsicElements> = WithNode<JSX.IntrinsicElements[TTag]>

const MemoH1: Component<HeadingProps<'h1'>> = (props) => (
  <h1
    class={cn('mt-6 mb-2 font-semibold text-3xl', props.class)}
    data-streamdown='heading-1'
    {...props}
  >
    {props.children}
  </h1>
)

const MemoH2: Component<HeadingProps<'h2'>> = (props) => (
  <h2
    class={cn('mt-6 mb-2 font-semibold text-2xl', props.class)}
    data-streamdown='heading-2'
    {...props}
  >
    {props.children}
  </h2>
)

const MemoH3: Component<HeadingProps<'h3'>> = (props) => (
  <h3
    class={cn('mt-6 mb-2 font-semibold text-xl', props.class)}
    data-streamdown='heading-3'
    {...props}
  >
    {props.children}
  </h3>
)

const MemoH4: Component<HeadingProps<'h4'>> = (props) => (
  <h4
    class={cn('mt-6 mb-2 font-semibold text-lg', props.class)}
    data-streamdown='heading-4'
    {...props}
  >
    {props.children}
  </h4>
)

const MemoH5: Component<HeadingProps<'h5'>> = (props) => (
  <h5
    class={cn('mt-6 mb-2 font-semibold text-base', props.class)}
    data-streamdown='heading-5'
    {...props}
  >
    {props.children}
  </h5>
)

const MemoH6: Component<HeadingProps<'h6'>> = (props) => (
  <h6
    class={cn('mt-6 mb-2 font-semibold text-sm', props.class)}
    data-streamdown='heading-6'
    {...props}
  >
    {props.children}
  </h6>
)

type TableProps = WithNode<JSX.IntrinsicElements['table']>
const MemoTable: Component<TableProps> = (props) => {
  const controlsConfig = useContext(ControlsContext)
  const showTableControls = shouldShowControls(controlsConfig, 'table')

  return (
    <div class='my-4 flex flex-col space-y-2' data-streamdown='table-wrapper'>
      {showTableControls && (
        <div class='flex items-center justify-end gap-1'>
          <TableCopyButton />
          <TableDownloadDropdown />
        </div>
      )}
      <div class='overflow-x-auto'>
        <table
          class={cn('w-full border-collapse border border-border', props.class)}
          data-streamdown='table'
          {...props}
        >
          {props.children}
        </table>
      </div>
    </div>
  )
}

type TheadProps = WithNode<JSX.IntrinsicElements['thead']>
const MemoThead: Component<TheadProps> = (props) => (
  <thead class={cn('bg-muted/80', props.class)} data-streamdown='table-header' {...props}>
    {props.children}
  </thead>
)

type TbodyProps = WithNode<JSX.IntrinsicElements['tbody']>
const MemoTbody: Component<TbodyProps> = (props) => (
  <tbody
    class={cn('divide-y divide-border bg-muted/40', props.class)}
    data-streamdown='table-body'
    {...props}
  >
    {props.children}
  </tbody>
)

type TrProps = WithNode<JSX.IntrinsicElements['tr']>
const MemoTr: Component<TrProps> = (props) => (
  <tr class={cn('border-border border-b', props.class)} data-streamdown='table-row' {...props}>
    {props.children}
  </tr>
)

type ThProps = WithNode<JSX.IntrinsicElements['th']>
const MemoTh: Component<ThProps> = (props) => (
  <th
    class={cn('whitespace-nowrap px-4 py-2 text-left font-semibold text-sm', props.class)}
    data-streamdown='table-header-cell'
    {...props}
  >
    {props.children}
  </th>
)

type TdProps = WithNode<JSX.IntrinsicElements['td']>
const MemoTd: Component<TdProps> = (props) => (
  <td class={cn('px-4 py-2 text-sm', props.class)} data-streamdown='table-cell' {...props}>
    {props.children}
  </td>
)

type BlockquoteProps = WithNode<JSX.IntrinsicElements['blockquote']>
const MemoBlockquote: Component<BlockquoteProps> = (props) => (
  <blockquote
    class={cn(
      'my-4 border-muted-foreground/30 border-l-4 pl-4 text-muted-foreground italic',
      props.class,
    )}
    data-streamdown='blockquote'
    {...props}
  >
    {props.children}
  </blockquote>
)

type SupProps = WithNode<JSX.IntrinsicElements['sup']>
const MemoSup: Component<SupProps> = (props) => (
  <sup class={cn('text-sm', props.class)} data-streamdown='superscript' {...props}>
    {props.children}
  </sup>
)

type SubProps = WithNode<JSX.IntrinsicElements['sub']>
const MemoSub: Component<SubProps> = (props) => (
  <sub class={cn('text-sm', props.class)} data-streamdown='subscript' {...props}>
    {props.children}
  </sub>
)

const CodeComponent = (props: {
  node?: MarkdownNode
  class?: string
  children?: JSX.Element
  [key: string]: any
}) => {
  const inline = props.node?.position?.start?.line === props.node?.position?.end?.line
  const mermaidConfig = useContext(MermaidConfigContext)
  const controlsConfig = useContext(ControlsContext)

  if (inline) {
    return (
      <code
        class={cn('rounded bg-muted px-1.5 py-0.5 font-mono text-sm', props.class)}
        data-streamdown='inline-code'
        {...props}
      >
        {props.children}
      </code>
    )
  }

  const match = props.class?.match(LANGUAGE_REGEX)
  const language = (match?.at(1) ?? '') as BundledLanguage

  // Extract code content from children safely
  let code = ''
  if (
    props.children &&
    typeof props.children === 'object' &&
    'props' in props.children &&
    props.children.props &&
    typeof props.children.props === 'object' &&
    'children' in props.children.props &&
    typeof props.children.props.children === 'string'
  ) {
    code = props.children.props.children
  } else if (typeof props.children === 'string') {
    code = props.children
  }

  if (language === 'mermaid') {
    const showMermaidControls = shouldShowControls(controlsConfig, 'mermaid')

    return (
      <div
        class={cn('group relative my-4 h-auto rounded-xl border p-4', props.class)}
        data-streamdown='mermaid-block'
      >
        {showMermaidControls && (
          <div class='flex items-center justify-end gap-2'>
            <CodeBlockDownloadButton code={code} language={language} />
            <CodeBlockCopyButton code={code} />
          </div>
        )}
        <Mermaid chart={code} config={mermaidConfig} />
      </div>
    )
  }

  const showCodeControls = shouldShowControls(controlsConfig, 'code')

  return (
    <CodeBlock
      class={cn('overflow-x-auto border-t', props.class)}
      code={code}
      data-language={language}
      data-streamdown='code-block'
      language={language}
      preClass='overflow-x-auto font-mono text-xs p-4 bg-muted/40'
    >
      {showCodeControls && (
        <>
          <CodeBlockDownloadButton code={code} language={language} />
          <CodeBlockCopyButton />
        </>
      )}
    </CodeBlock>
  )
}

const MemoCode: Component<{
  node?: MarkdownNode
  class?: string
  children?: JSX.Element
  [key: string]: any
}> = CodeComponent

const MemoImg: Component<{
  node?: MarkdownNode
  class?: string
  src?: string
  alt?: string
  [key: string]: any
}> = ImageComponent

export const components = {
  ol: MemoOl,
  li: MemoLi,
  ul: MemoUl,
  hr: MemoHr,
  strong: MemoStrong,
  a: MemoA,
  h1: MemoH1,
  h2: MemoH2,
  h3: MemoH3,
  h4: MemoH4,
  h5: MemoH5,
  h6: MemoH6,
  table: MemoTable,
  thead: MemoThead,
  tbody: MemoTbody,
  tr: MemoTr,
  th: MemoTh,
  td: MemoTd,
  blockquote: MemoBlockquote,
  code: MemoCode,
  img: MemoImg,
  pre: ({ children }: { children?: JSX.Element }) => children,
  sup: MemoSup,
  sub: MemoSub,
}

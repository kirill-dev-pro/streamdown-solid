import { CheckIcon, CopyIcon, DownloadIcon } from 'lucide-solid'
import { createEffect, createSignal, type JSX } from 'solid-js'
import { cn, save } from './utils'

type TableData = {
  headers: string[]
  rows: string[][]
}

function extractTableDataFromElement(tableElement: HTMLElement): TableData {
  const headers: string[] = []
  const rows: string[][] = []

  // Extract headers
  const headerCells = tableElement.querySelectorAll('thead th')
  for (const cell of headerCells) {
    headers.push(cell.textContent?.trim() || '')
  }

  // Extract rows
  const bodyRows = tableElement.querySelectorAll('tbody tr')
  for (const row of bodyRows) {
    const rowData: string[] = []
    const cells = row.querySelectorAll('td')
    for (const cell of cells) {
      rowData.push(cell.textContent?.trim() || '')
    }
    rows.push(rowData)
  }

  return { headers, rows }
}

function tableDataToCSV(data: TableData): string {
  const { headers, rows } = data

  const escapeCSV = (value: string): string => {
    // If the value contains comma, quote, or newline, wrap in quotes and escape internal quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  const csvRows: string[] = []

  // Add headers
  if (headers.length > 0) {
    csvRows.push(headers.map(escapeCSV).join(','))
  }

  // Add data rows
  for (const row of rows) {
    csvRows.push(row.map(escapeCSV).join(','))
  }

  return csvRows.join('\n')
}

function tableDataToMarkdown(data: TableData): string {
  const { headers, rows } = data

  if (headers.length === 0) {
    return ''
  }

  const markdownRows: string[] = []

  // Add headers
  const escapedHeaders = headers.map((h) => h.replace(/\|/g, '\\|'))
  markdownRows.push(`| ${escapedHeaders.join(' | ')} |`)

  // Add separator row
  markdownRows.push(`| ${headers.map(() => '---').join(' | ')} |`)

  // Add data rows
  for (const row of rows) {
    // Pad row with empty strings if it's shorter than headers
    const paddedRow = [...row]
    while (paddedRow.length < headers.length) {
      paddedRow.push('')
    }
    const escapedRow = paddedRow.map((cell) => cell.replace(/\|/g, '\\|'))
    markdownRows.push(`| ${escapedRow.join(' | ')} |`)
  }

  return markdownRows.join('\n')
}

export type TableCopyButtonProps = {
  children?: JSX.Element
  className?: string
  onCopy?: () => void
  onError?: (error: Error) => void
  timeout?: number
  format?: 'csv' | 'markdown' | 'text'
}

export const TableCopyButton = (props: TableCopyButtonProps) => {
  const [isCopied, setIsCopied] = createSignal(false)
  let timeoutRef: number = 0

  const copyTableData = async (event: MouseEvent) => {
    if (typeof window === 'undefined' || !navigator?.clipboard?.write) {
      props.onError?.(new Error('Clipboard API not available'))
      return
    }

    try {
      if (!isCopied()) {
        // Find the closest table element
        const button = event.currentTarget as HTMLButtonElement
        const tableWrapper = button.closest('[data-streamdown="table-wrapper"]')
        const tableElement = tableWrapper?.querySelector('table') as HTMLTableElement

        if (!tableElement) {
          props.onError?.(new Error('Table not found'))
          return
        }

        const tableData = extractTableDataFromElement(tableElement)
        const clipboardItemData = new ClipboardItem({
          'text/plain':
            props.format === 'markdown'
              ? tableDataToMarkdown(tableData)
              : tableDataToCSV(tableData),
          'text/html': new Blob([tableElement.outerHTML], {
            type: 'text/html',
          }),
        })

        await navigator.clipboard.write([clipboardItemData])
        setIsCopied(true)
        props.onCopy?.()
        timeoutRef = window.setTimeout(() => setIsCopied(false), props.timeout || 2000)
      }
    } catch (error) {
      props.onError?.(error as Error)
    }
  }

  createEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef)
    }
  })

  return (
    <button
      class={cn(
        'cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground',
        props.className,
      )}
      onClick={copyTableData}
      title={`Copy table as ${props.format || 'markdown'}`}
      type='button'
    >
      {props.children ?? (isCopied() ? <CheckIcon size={14} /> : <CopyIcon size={14} />)}
    </button>
  )
}

export type TableDownloadButtonProps = {
  children?: JSX.Element
  className?: string
  onDownload?: () => void
  onError?: (error: Error) => void
  format?: 'csv' | 'markdown'
  filename?: string
}

export const TableDownloadButton = (props: TableDownloadButtonProps) => {
  const downloadTableData = (event: MouseEvent) => {
    try {
      // Find the closest table element
      const button = event.currentTarget as HTMLButtonElement
      const tableWrapper = button.closest('[data-streamdown="table-wrapper"]')
      const tableElement = tableWrapper?.querySelector('table') as HTMLTableElement

      if (!tableElement) {
        props.onError?.(new Error('Table not found'))
        return
      }

      const tableData = extractTableDataFromElement(tableElement)
      let content = ''
      let mimeType = ''
      let extension = ''

      switch (props.format || 'csv') {
        case 'csv':
          content = tableDataToCSV(tableData)
          mimeType = 'text/csv'
          extension = 'csv'
          break
        case 'markdown':
          content = tableDataToMarkdown(tableData)
          mimeType = 'text/markdown'
          extension = 'md'
          break
        default:
          content = tableDataToCSV(tableData)
          mimeType = 'text/csv'
          extension = 'csv'
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${props.filename || 'table'}.${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      props.onDownload?.()
    } catch (error) {
      props.onError?.(error as Error)
    }
  }

  return (
    <button
      class={cn(
        'cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground',
        props.className,
      )}
      onClick={downloadTableData}
      title={`Download table as ${(props.format || 'csv').toUpperCase()}`}
      type='button'
    >
      {props.children ?? <DownloadIcon size={14} />}
    </button>
  )
}

export type TableDownloadDropdownProps = {
  children?: JSX.Element
  className?: string
  onDownload?: (format: 'csv' | 'markdown') => void
  onError?: (error: Error) => void
}

export const TableDownloadDropdown = (props: TableDownloadDropdownProps) => {
  const [isOpen, setIsOpen] = createSignal(false)
  let dropdownRef: HTMLDivElement | undefined

  const downloadTableData = (format: 'csv' | 'markdown') => {
    try {
      const tableWrapper = dropdownRef?.closest('[data-streamdown="table-wrapper"]')
      const tableElement = tableWrapper?.querySelector('table') as HTMLTableElement

      if (!tableElement) {
        props.onError?.(new Error('Table not found'))
        return
      }

      const tableData = extractTableDataFromElement(tableElement)
      const content = format === 'csv' ? tableDataToCSV(tableData) : tableDataToMarkdown(tableData)
      const extension = format === 'csv' ? 'csv' : 'md'
      const filename = `table.${extension}`
      const mimeType = format === 'csv' ? 'text/csv' : 'text/markdown'

      save(filename, content, mimeType)
      setIsOpen(false)
      props.onDownload?.(format)
    } catch (error) {
      props.onError?.(error as Error)
    }
  }

  createEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <div class='relative' ref={dropdownRef}>
      <button
        class={cn(
          'cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground',
          props.className,
        )}
        onClick={() => setIsOpen(!isOpen())}
        title='Download table'
        type='button'
      >
        {props.children ?? <DownloadIcon size={14} />}
      </button>
      {isOpen() && (
        <div class='absolute top-full right-0 z-10 mt-1 min-w-[120px] rounded-md border border-border bg-background shadow-lg'>
          <button
            class='w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40'
            onClick={() => downloadTableData('csv')}
            type='button'
          >
            CSV
          </button>
          <button
            class='w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40'
            onClick={() => downloadTableData('markdown')}
            type='button'
          >
            Markdown
          </button>
        </div>
      )}
    </div>
  )
}

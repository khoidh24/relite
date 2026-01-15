'use client'

import { Action } from '@/types'
import { FileItem } from './file-item'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw } from 'lucide-react'

interface FileListProps {
  actions: Action[]
  onConvertAll: () => void
  onDelete: (action: Action) => void
  onDownload: (action: Action) => void
  onDownloadAll: () => void
  onFormatChange: (action: Action, format: string) => void
}

export function FileList({
  actions,
  onConvertAll,
  onDelete,
  onDownload,
  onDownloadAll,
  onFormatChange
}: FileListProps) {
  const hasConvertedFiles = actions.some((action) => action.is_converted)
  const hasUnconvertedFiles = actions.some(
    (action) => !action.is_converted && !action.is_converting
  )
  const isConverting = actions.some((action) => action.is_converting)
  const hasMultipleFiles = actions.length > 1

  if (actions.length === 0) {
    return null
  }

  return (
    <div className='space-y-4 w-full'>
      <div className='flex items-center justify-between gap-2'>
        <h2 className='text-lg sm:text-xl font-semibold'>
          Files ({actions.length})
        </h2>
        <div className='flex gap-2'>
          {hasUnconvertedFiles && (
            <Button
              onClick={onConvertAll}
              disabled={isConverting}
              className='gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm'
              size='sm'
            >
              <RefreshCw className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
              <span className='hidden xs:inline'>
                {actions.length === 1 ? 'Convert' : 'Convert All'}
              </span>
              <span className='xs:hidden'>Convert</span>
            </Button>
          )}
          {hasConvertedFiles && (
            <Button
              onClick={onDownloadAll}
              variant='outline'
              className='gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm'
              size='sm'
            >
              <Download className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
              <span className='text-sm'>
                {hasMultipleFiles ? 'Download All' : 'Download'}
              </span>
            </Button>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        {actions.map((action) => (
          <FileItem
            key={action.id}
            action={action}
            onDelete={onDelete}
            onDownload={onDownload}
            onFormatChange={onFormatChange}
          />
        ))}
      </div>
    </div>
  )
}

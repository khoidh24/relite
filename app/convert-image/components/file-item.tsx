'use client'

import { Action } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import bytesToSize from '@/utils/bytes-to-size'
import compressFileName from '@/utils/compress-file-name'
import fileToIcon from '@/utils/file-to-icon'
import { CheckCircle2, Download, Loader2, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileItemProps {
  action: Action
  onDelete: (action: Action) => void
  onDownload: (action: Action) => void
  onFormatChange: (action: Action, format: string) => void
}

const IMAGE_FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'ico']

export function FileItem({
  action,
  onDelete,
  onDownload,
  onFormatChange
}: FileItemProps) {
  return (
    <Card
      className={cn(
        'p-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2',
        action.is_error && 'border-destructive'
      )}
    >
      {/* Desktop Layout */}
      <div className='hidden sm:flex items-center gap-3'>
        <div className='shrink-0 text-muted-foreground'>
          {fileToIcon(action.file_type)}
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <p className='text-sm font-medium truncate'>
              {compressFileName(action.file_name)}
            </p>
            <Badge variant='secondary' className='text-xs shrink-0'>
              {action.from.toString().toUpperCase()}
            </Badge>
            {action.to && (
              <>
                <span className='text-xs text-muted-foreground'>→</span>
                <Badge variant='default' className='text-xs shrink-0'>
                  {action.to.toString().toUpperCase()}
                </Badge>
              </>
            )}
          </div>
          <div className='flex items-center gap-3 mt-0.5'>
            <p className='text-xs text-muted-foreground'>
              {bytesToSize(action.file_size)}
            </p>

            {action.is_converting && (
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <Loader2 className='w-3 h-3 animate-spin' />
                <span>{action.progress || 0}%</span>
              </div>
            )}

            {action.is_converted && (
              <div className='flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400'>
                <CheckCircle2 className='w-3 h-3' />
                <span>Done</span>
              </div>
            )}

            {action.is_error && (
              <div className='flex items-center gap-1.5 text-xs text-destructive'>
                <XCircle className='w-3 h-3' />
                <span>{action.error_message || 'Failed'}</span>
              </div>
            )}
          </div>

          {action.is_converting && (
            <Progress value={action.progress || 0} className='h-1 mt-2' />
          )}
        </div>

        <div className='flex items-center gap-2 shrink-0'>
          {!action.is_converted && !action.is_converting && (
            <Select
              value={action.to?.toString() || ''}
              onValueChange={(value) => onFormatChange(action, value)}
            >
              <SelectTrigger className='w-20 h-8 text-xs'>
                <SelectValue placeholder='Format' />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_FORMATS.filter((format) => format !== action.from).map(
                  (format) => (
                    <SelectItem key={format} value={format}>
                      {format.toUpperCase()}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          )}

          {action.is_converted && (
            <Button
              size='sm'
              variant='default'
              onClick={() => onDownload(action)}
              className='h-8 gap-1.5'
            >
              <Download className='w-3.5 h-3.5' />
              <span className='text-xs'>Download</span>
            </Button>
          )}

          <Button
            size='icon'
            variant='ghost'
            onClick={() => onDelete(action)}
            disabled={action.is_converting}
            className='h-8 w-8'
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='sm:hidden space-y-3'>
        <div className='flex items-start gap-2'>
          <div className='shrink-0 text-muted-foreground mt-0.5'>
            {fileToIcon(action.file_type)}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium truncate'>
              {compressFileName(action.file_name)}
            </p>
            <div className='flex items-center gap-2 mt-1.5'>
              <Badge variant='secondary' className='text-xs'>
                {action.from.toString().toUpperCase()}
              </Badge>
              {action.to && (
                <>
                  <span className='text-xs text-muted-foreground'>→</span>
                  <Badge variant='default' className='text-xs'>
                    {action.to.toString().toUpperCase()}
                  </Badge>
                </>
              )}
            </div>
            <p className='text-xs text-muted-foreground mt-2'>
              {bytesToSize(action.file_size)}
            </p>
          </div>
          <Button
            size='icon'
            variant='ghost'
            onClick={() => onDelete(action)}
            disabled={action.is_converting}
            className='h-8 w-8 shrink-0'
          >
            <X className='w-4 h-4' />
          </Button>
        </div>

        {action.is_converting && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-xs'>
              <div className='flex items-center gap-1.5 text-muted-foreground'>
                <Loader2 className='w-3 h-3 animate-spin' />
                <span>Converting...</span>
              </div>
              <span className='text-muted-foreground'>
                {action.progress || 0}%
              </span>
            </div>
            <Progress value={action.progress || 0} className='h-1.5' />
          </div>
        )}

        {action.is_converted && (
          <div className='flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400'>
            <CheckCircle2 className='w-3 h-3' />
            <span>Converted successfully!</span>
          </div>
        )}

        {action.is_error && (
          <div className='space-y-1'>
            <div className='flex items-center gap-1.5 text-xs text-destructive'>
              <XCircle className='w-3 h-3' />
              <span>Conversion failed</span>
            </div>
            {action.error_message && (
              <p className='text-xs text-destructive/80'>
                {action.error_message}
              </p>
            )}
          </div>
        )}

        <div className='flex gap-2'>
          {!action.is_converted && !action.is_converting && (
            <Select
              value={action.to?.toString() || ''}
              onValueChange={(value) => onFormatChange(action, value)}
            >
              <SelectTrigger className='flex-1 h-9 text-xs'>
                <SelectValue placeholder='Select format' />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_FORMATS.filter((format) => format !== action.from).map(
                  (format) => (
                    <SelectItem key={format} value={format}>
                      {format.toUpperCase()}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          )}

          {action.is_converted && (
            <Button
              size='sm'
              variant='default'
              onClick={() => onDownload(action)}
              className='flex-1 h-9 gap-2'
            >
              <Download className='w-4 h-4' />
              <span>Download</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

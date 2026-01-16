'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface DropzoneProps {
  onFilesAccepted: (files: File[]) => void
  accept?: Record<string, string[]>
  maxFiles?: number
}

export function Dropzone({
  onFilesAccepted,
  accept = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
  },
  maxFiles = 20
}: DropzoneProps) {
  const t = useTranslations('ConvertImage')
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAccepted(acceptedFiles)
    },
    [onFilesAccepted]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-4 sm:p-12 text-center cursor-pointer transition-all duration-300',
        'hover:border-primary hover:bg-primary/5 w-full',
        isDragActive
          ? 'border-primary bg-primary/5 scale-105'
          : 'border-primary/25'
      )}
    >
      <input {...getInputProps()} />
      <div className='flex flex-col items-center gap-3 sm:gap-4'>
        <div
          className={cn(
            'p-3 sm:p-4 rounded-full bg-accent transition-transform duration-300',
            isDragActive && 'scale-110'
          )}
        >
          <Upload
            className={cn(
              'w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground transition-colors duration-300',
              isDragActive && 'text-background'
            )}
          />
        </div>
        <div>
          <p className='text-base sm:text-lg font-medium'>
            {isDragActive ? t('drop_the_file_here') : t('drag_and_drop')}
          </p>
          <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
            {t('or_click_to_select', { maxFiles })}
          </p>
        </div>
      </div>
    </div>
  )
}

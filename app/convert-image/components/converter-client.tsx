'use client'

import { useState, useRef, useEffect } from 'react'
import { Action } from '@/types'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { Dropzone } from './dropzone'
import { FileList } from './file-list'
import { FormatSelector } from './format-selector'
import { LoadingSpinner } from './loading-spinner'
import loadFfmpeg from '@/utils/load-ffmpeg'
import convert from '@/utils/convert'

export function ConverterClient() {
  const [actions, setActions] = useState<Action[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [defaultFormat, setDefaultFormat] = useState('webp')
  const ffmpegRef = useRef<FFmpeg | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const ffmpeg = await loadFfmpeg()
        ffmpegRef.current = ffmpeg
        setIsLoaded(true)
      } catch (error) {
        console.error('Failed to load FFmpeg:', error)
      }
    }
    load()
  }, [])

  const handleFilesAccepted = (files: File[]) => {
    const newActions: Action[] = files.map((file) => ({
      file,
      file_name: file.name,
      file_size: file.size,
      from: file.name.split('.').pop() || '',
      to: defaultFormat,
      file_type: file.type,
      is_converting: false,
      is_converted: false,
      is_error: false,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      progress: 0
    }))

    setActions((prev) => [...prev, ...newActions])
  }

  const handleConvert = async (action: Action) => {
    if (!ffmpegRef.current || !action.to) return

    const actionId = action.id

    setActions((prev) =>
      prev.map((a) =>
        a.id === actionId
          ? { ...a, is_converting: true, is_error: false, progress: 0 }
          : a
      )
    )

    try {
      const progressInterval = setInterval(() => {
        setActions((prev) =>
          prev.map((a) => {
            if (a.id === actionId && a.is_converting) {
              const currentProgress = a.progress || 0
              return {
                ...a,
                progress: Math.min(currentProgress + 10, 90)
              }
            }
            return a
          })
        )
      }, 200)

      const { url, output } = await convert(ffmpegRef.current, action)

      clearInterval(progressInterval)

      setActions((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? {
                ...a,
                is_converting: false,
                is_converted: true,
                url,
                output,
                progress: 100
              }
            : a
        )
      )
    } catch (error) {
      console.error('Conversion error:', error)
      setActions((prev) =>
        prev.map((a) =>
          a.id === actionId ? { ...a, is_converting: false, is_error: true } : a
        )
      )
    }
  }

  const handleConvertAll = async () => {
    const unconvertedActions = actions.filter(
      (action) => !action.is_converted && !action.is_converting && action.to
    )

    for (const action of unconvertedActions) {
      await handleConvert(action)
    }
  }

  const handleDelete = (action: Action) => {
    setActions((prev) => prev.filter((a) => a.id !== action.id))
    if (action.url) {
      URL.revokeObjectURL(action.url)
    }
  }

  const handleDownload = (action: Action) => {
    if (!action.url || !action.output) return

    const a = document.createElement('a')
    a.href = action.url
    a.download = action.output
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleDownloadAll = () => {
    actions
      .filter((action) => action.is_converted)
      .forEach((action) => {
        handleDownload(action)
      })
  }

  const handleFormatChange = (action: Action, format: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === action.id ? { ...a, to: format } : a))
    )
  }

  if (!isLoaded) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className='space-y-6 sm:space-y-8'>
      <div className='flex justify-center'>
        <FormatSelector value={defaultFormat} onChange={setDefaultFormat} />
      </div>

      <Dropzone onFilesAccepted={handleFilesAccepted} />

      <FileList
        actions={actions}
        onConvertAll={handleConvertAll}
        onDelete={handleDelete}
        onDownload={handleDownload}
        onDownloadAll={handleDownloadAll}
        onFormatChange={handleFormatChange}
      />
    </div>
  )
}

import { Action } from '@/types'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

function getFileExtension(file_name: string): string {
  const regex = /(?:\.([^.]+))?$/
  const match = regex.exec(file_name)
  if (match && match[1]) {
    return match[1]
  }
  return ''
}

function removeFileExtension(file_name: string): string {
  const lastDotIndex = file_name.lastIndexOf('.')
  if (lastDotIndex !== -1) {
    return file_name.slice(0, lastDotIndex)
  }
  return file_name
}

// Formats that FFmpeg cannot convert to
const UNSUPPORTED_OUTPUT_FORMATS = ['svg']

// Formats that FFmpeg cannot convert from
const UNSUPPORTED_INPUT_FORMATS = ['svg']

export default async function convert(
  ffmpeg: FFmpeg,
  action: Action
): Promise<{ url: string; output: string }> {
  const { file, to, file_name, file_type } = action

  if (!to) {
    throw new Error('Output format is required')
  }

  const fromFormat = getFileExtension(file_name).toLowerCase()
  const toFormat = to.toLowerCase()

  // Check if conversion is supported
  if (UNSUPPORTED_OUTPUT_FORMATS.includes(toFormat)) {
    throw new Error(
      `Cannot convert to ${toFormat.toUpperCase()}. This format is not supported for conversion.`
    )
  }

  if (UNSUPPORTED_INPUT_FORMATS.includes(fromFormat)) {
    throw new Error(
      `Cannot convert from ${fromFormat.toUpperCase()}. This format is not supported for conversion.`
    )
  }

  const input = getFileExtension(file_name)
  const output = removeFileExtension(file_name) + '.' + to

  try {
    await ffmpeg.writeFile(input, await fetchFile(file))

    let ffmpeg_cmd: string[] = []

    if (to === '3gp') {
      ffmpeg_cmd = [
        '-i',
        input,
        '-r',
        '20',
        '-s',
        '352x288',
        '-vb',
        '400k',
        '-acodec',
        'aac',
        '-strict',
        'experimental',
        '-ac',
        '1',
        '-ar',
        '8000',
        '-ab',
        '24k',
        output
      ]
    } else {
      ffmpeg_cmd = ['-i', input, output]
    }

    await ffmpeg.exec(ffmpeg_cmd)

    const data = await ffmpeg.readFile(output)
    const blob = new Blob([data as BlobPart], {
      type: file_type.split('/')[0]
    })
    const url = URL.createObjectURL(blob)

    // Clean up
    await ffmpeg.deleteFile(input)
    await ffmpeg.deleteFile(output)

    return { url, output }
  } catch (error) {
    // Clean up on error
    try {
      await ffmpeg.deleteFile(input)
    } catch {
      // Ignore cleanup errors
    }
    throw error
  }
}

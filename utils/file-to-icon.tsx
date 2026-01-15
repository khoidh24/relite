import { Camera, File, FileArchive, Image, Speaker } from 'lucide-react'
import { ReactElement } from 'react'

export default function fileToIcon(file_type: string): ReactElement {
  if (file_type.includes('video')) return <Camera size={36} />
  if (file_type.includes('audio')) return <Speaker size={36} />
  if (file_type.includes('text')) return <File size={36} />
  if (file_type.includes('image')) return <Image size={36} />
  return <FileArchive />
}

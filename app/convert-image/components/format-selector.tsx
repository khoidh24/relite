'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'

interface FormatSelectorProps {
  value: string
  onChange: (value: string) => void
}

const IMAGE_FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'ico']

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  const t = useTranslations('ConvertImage')
  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 max-lg:w-full'>
      <Label
        htmlFor='default-format'
        className='text-sm font-medium whitespace-nowrap'
      >
        {t('default_format')}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id='default-format' className='w-full sm:w-32'>
          <SelectValue placeholder='Select format' />
        </SelectTrigger>
        <SelectContent>
          {IMAGE_FORMATS.map((format) => (
            <SelectItem key={format} value={format}>
              {format.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

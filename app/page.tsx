import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ConverterClient } from './convert-image/components/converter-client'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ConvertImage')

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      'image converter',
      'convert image',
      'png to jpg',
      'jpg to png',
      'webp converter',
      'image format converter',
      'relite',
      'chuyển đổi hình ảnh',
      'đổi định dạng ảnh'
    ],
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description')
    }
  }
}

export default async function ConvertImagePage() {
  const t = await getTranslations('ConvertImage')
  return (
    <div className='container mx-auto px-4 py-6 sm:py-8 max-w-5xl'>
      <div className='lg:gap-8 gap-6 min-h-[640px] flex flex-col lg:justify-center'>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl sm:text-4xl font-bold'>{t('title')}</h1>
          <p className='text-xs sm:text-base text-muted-foreground'>
            {t('description')}
          </p>
        </div>

        <ConverterClient />
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Figtree } from 'next/font/google'
import './globals.css'

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' })

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  subsets: ['latin'],
  weight: ['400', '500', '700']
})

export const metadata: Metadata = {
  title: 'Relite',
  description: 'Where we can re-ly on convinience and lightning-fast.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={figtree.variable}>
      <body className={`${beVietnamPro.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}

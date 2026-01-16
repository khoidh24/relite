'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { ThemeProvider } from '@/components/theme-provider'
import { ReactNode } from 'react'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme={'system'}
      enableSystem
      disableTransitionOnChange
    >
      <header className='container mx-auto w-full py-4'>
        <div className='flex justify-end items-center'>
          <ModeToggle />
        </div>
      </header>
      <main>{children}</main>
    </ThemeProvider>
  )
}

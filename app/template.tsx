'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { ThemeProvider } from '@/components/theme-provider'
import { ReactNode, useCallback, useState } from 'react'

export default function Template({ children }: { children: ReactNode }) {
  const theme = useCallback(() => {
    if (typeof window === 'undefined') return 'system'

    const savedTheme = localStorage.getItem('theme')
    if (!savedTheme) {
      localStorage.setItem('theme', 'system')
      return 'system'
    }
    return savedTheme
  }, [])

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme={theme.toString()}
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

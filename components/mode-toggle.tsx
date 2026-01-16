'use client'

import { Check, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useMemo } from 'react'

export function ModeToggle() {
  const THEMES = useMemo(
    () => [
      {
        name: 'Light',
        value: 'light'
      },
      {
        name: 'Dark',
        value: 'dark'
      },
      {
        name: 'System',
        value: 'system'
      }
    ],
    []
  )

  const { theme: defaultTheme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {THEMES.map((theme) => (
          <DropdownMenuItem
            onClick={() => setTheme(theme.value)}
            key={theme.value}
            className='flex justify-between items-center'
          >
            {theme.name}
            {defaultTheme === theme.value && <Check />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

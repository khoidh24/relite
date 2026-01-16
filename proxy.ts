import { notFound } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Chặn /api -> 404
  if (pathname.startsWith('/api')) {
    return notFound()
  }

  const localeCookie = request.cookies.get('relite-locale')?.value
  const country = request.headers.get('x-vercel-ip-country')

  if (!localeCookie) {
    const nextLocale = country === 'VN' ? 'vi' : 'en'
    NextResponse.next().cookies.set('relite-locale', nextLocale, {
      path: '/',
      secure: true,
      sameSite: 'strict',
      expires: 31536000
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'
  ]
}

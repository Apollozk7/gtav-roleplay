import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    if (isAdminPage && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
        const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

        if (isAuthPage) {
          return true
        }

        if (isAdminPage) {
          return token?.role === 'ADMIN'
        }

        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}



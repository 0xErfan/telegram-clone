import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

    const token = request.cookies.get('token')?.value

    if (request.nextUrl.pathname.startsWith('authentication')) {
        // if (token) return NextResponse.redirect(new URL('/', request.url))
    }

    NextResponse.next()
}

export const config = {
    matcher: ['/authentication']
}
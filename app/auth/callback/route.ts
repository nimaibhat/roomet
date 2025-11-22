import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  // Redirect to home page with success parameter
  // The client will handle the session exchange via Supabase
  const redirectUrl = code 
    ? new URL('/?auth=success', origin)
    : new URL('/', origin)

  return NextResponse.redirect(redirectUrl)
}


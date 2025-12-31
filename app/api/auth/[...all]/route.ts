import { auth } from '@/lib/auth/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { type NextRequest, NextResponse } from 'next/server';

const handler = toNextJsHandler(auth);

// Add error logging wrapper
const withErrorLogging = (
  handlerFn: (request: NextRequest) => Promise<Response>
) => {
  return async (request: NextRequest) => {
    try {
      const url = new URL(request.url);
      console.log('[Auth API] Request:', {
        method: request.method,
        pathname: url.pathname,
        search: url.search,
      });
      
      const response = await handlerFn(request);
      
      // Clone response to read body if needed (for logging)
      const clonedResponse = response.clone();
      console.log('[Auth API] Response:', {
        status: response.status,
        statusText: response.statusText,
      });
      
      // Log error response body if status is not 2xx
      if (response.status >= 400) {
        try {
          const errorBody = await clonedResponse.text();
          console.error('[Auth API] Error response body:', errorBody);
        } catch (e) {
          // Ignore errors reading response body
        }
      }
      
      return response;
    } catch (error) {
      console.error('[Auth API] Unhandled exception:', error);
      console.error('[Auth API] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  };
};

export const POST = withErrorLogging(handler.POST);
export const GET = withErrorLogging(handler.GET);

// Handle OPTIONS preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'].filter(
    Boolean
  );

  // In development, allow localhost on common ports
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push(
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
      'http://127.0.0.1:3003'
    );
  }

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { OAuthServer } from '@/lib/oauth';

export async function POST(request: NextRequest) {
  try {
    const { access_token } = await request.json();

    if (!access_token) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'access_token is required' },
        { status: 400 }
      );
    }

    const tokenInfo = await OAuthServer.validateAccessToken(access_token);

    if (!tokenInfo) {
      return NextResponse.json({
        valid: false,
        error: 'invalid_token',
        error_description: 'Invalid or expired access token',
      });
    }

    return NextResponse.json({
      valid: true,
      user_id: tokenInfo.userId,
      scopes: tokenInfo.scopes,
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'Internal server error' },
      { status: 500 }
    );
  }
}

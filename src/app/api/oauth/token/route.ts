import { NextRequest, NextResponse } from 'next/server';
import { OAuthServer } from '@/lib/oauth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const params = new URLSearchParams();
    
    // Конвертируем FormData в URLSearchParams
    for (const [key, value] of formData.entries()) {
      params.set(key, value.toString());
    }

    // Валидация параметров
    const validationError = OAuthServer.validateTokenParams(params);
    if (validationError) {
      return NextResponse.json(validationError, { status: 400 });
    }

    const grantType = params.get('grant_type')!;
    const clientId = params.get('client_id')!;
    const clientSecret = params.get('client_secret')!;

    // Получение приложения
    const application = await OAuthServer.getApplication(clientId);
    if (!application) {
      return NextResponse.json(
        { error: 'invalid_client', error_description: 'Invalid client_id' },
        { status: 400 }
      );
    }

    // Валидация client_secret
    if (application.clientSecret !== clientSecret) {
      return NextResponse.json(
        { error: 'invalid_client', error_description: 'Invalid client_secret' },
        { status: 400 }
      );
    }

    let result;

    if (grantType === 'authorization_code') {
      const code = params.get('code');
      const redirectUri = params.get('redirect_uri');

      if (!code) {
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'code is required' },
          { status: 400 }
        );
      }

      if (!redirectUri) {
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'redirect_uri is required' },
          { status: 400 }
        );
      }

      result = await OAuthServer.exchangeCodeForToken(code, clientId, redirectUri);

    } else if (grantType === 'refresh_token') {
      const refreshToken = params.get('refresh_token');

      if (!refreshToken) {
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'refresh_token is required' },
          { status: 400 }
        );
      }

      result = await OAuthServer.refreshAccessToken(refreshToken, clientId);

    } else {
      return NextResponse.json(
        { error: 'unsupported_grant_type', error_description: 'Grant type not supported' },
        { status: 400 }
      );
    }

    if ('error' in result) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('OAuth token error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'Internal server error' },
      { status: 500 }
    );
  }
}

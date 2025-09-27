import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OAuthServer } from '@/lib/oauth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Валидация параметров
    const validationError = OAuthServer.validateAuthorizationParams(searchParams);
    if (validationError) {
      const errorParams = new URLSearchParams();
      errorParams.set('error', validationError.error);
      if (validationError.error_description) {
        errorParams.set('error_description', validationError.error_description);
      }
      if (validationError.error_uri) {
        errorParams.set('error_uri', validationError.error_uri);
      }
      const redirectUri = searchParams.get('redirect_uri');
      const state = searchParams.get('state');
      
      if (redirectUri) {
        const errorUrl = new URL(redirectUri);
        errorParams.forEach((value, key) => {
          errorUrl.searchParams.set(key, value);
        });
        if (state) {
          errorUrl.searchParams.set('state', state);
        }
        return NextResponse.redirect(errorUrl);
      }
      
      return NextResponse.json(validationError, { status: 400 });
    }

    const clientId = searchParams.get('client_id')!;
    const redirectUri = searchParams.get('redirect_uri')!;
    const state = searchParams.get('state');
    const scope = searchParams.get('scope') || 'read profile';
    const requestedScopes = scope.split(' ').filter(s => s.trim());

    // Получение приложения
    const application = await OAuthServer.getApplication(clientId);
    if (!application) {
      const errorParams = new URLSearchParams({
        error: 'invalid_client',
        error_description: 'Invalid client_id',
      });
      if (state) errorParams.set('state', state);
      
      const errorUrl = new URL(redirectUri);
      errorParams.forEach((value, key) => {
        errorUrl.searchParams.set(key, value);
      });
      return NextResponse.redirect(errorUrl);
    }

    // Валидация redirect URI
    if (!OAuthServer.validateRedirectUri(application, redirectUri)) {
      const errorParams = new URLSearchParams({
        error: 'invalid_request',
        error_description: 'Invalid redirect_uri',
      });
      if (state) errorParams.set('state', state);
      
      const errorUrl = new URL(redirectUri);
      errorParams.forEach((value, key) => {
        errorUrl.searchParams.set(key, value);
      });
      return NextResponse.redirect(errorUrl);
    }

    // Валидация scope
    const validScopes = OAuthServer.validateScope(application, requestedScopes);

    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session) {
      // Перенаправляем на страницу входа
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Создание кода авторизации
    const authCode = await OAuthServer.createAuthorizationCode(
      session.user.id,
      clientId,
      redirectUri,
      validScopes
    );

    // Перенаправление с кодом
    const successUrl = new URL(redirectUri);
    successUrl.searchParams.set('code', authCode);
    if (state) {
      successUrl.searchParams.set('state', state);
    }

    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error('OAuth authorize error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'Internal server error' },
      { status: 500 }
    );
  }
}

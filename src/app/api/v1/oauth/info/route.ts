import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Информация о OAuth сервере
    const baseUrl = new URL(request.url).origin;
    
    return NextResponse.json({
      issuer: baseUrl,
      authorization_endpoint: `${baseUrl}/api/oauth/authorize`,
      token_endpoint: `${baseUrl}/api/oauth/token`,
      userinfo_endpoint: `${baseUrl}/api/v1/user`,
      profile_endpoint: `${baseUrl}/api/v1/user/profile`,
      token_validation_endpoint: `${baseUrl}/api/v1/token/validate`,
      scopes_supported: [
        'read',
        'profile',
        'email',
        'misis_data',
      ],
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      token_endpoint_auth_methods_supported: ['client_secret_post'],
      code_challenge_methods_supported: [],
      service_documentation: `${baseUrl}/docs`,
      ui_locales_supported: ['ru', 'en'],
    });

  } catch (error) {
    console.error('OAuth info error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'Internal server error' },
      { status: 500 }
    );
  }
}

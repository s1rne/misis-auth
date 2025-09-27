import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import OAuthApplication, { IOAuthApplication } from '@/models/OAuthApplication';
import OAuthCode from '@/models/OAuthCode';
import OAuthToken from '@/models/OAuthToken';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export interface OAuthError {
  error: string;
  error_description?: string;
  error_uri?: string;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

export class OAuthServer {
  private static readonly SUPPORTED_GRANT_TYPES = ['authorization_code', 'refresh_token'];
  private static readonly SUPPORTED_RESPONSE_TYPES = ['code'];
  private static readonly DEFAULT_SCOPES = ['read', 'profile'];
  private static readonly CODE_EXPIRES_IN = 10 * 60; // 10 минут
  private static readonly ACCESS_TOKEN_EXPIRES_IN = 3600; // 1 час
  private static readonly REFRESH_TOKEN_EXPIRES_IN = 30 * 24 * 3600; // 30 дней

  // Валидация параметров авторизации
  static validateAuthorizationParams(params: URLSearchParams): OAuthError | null {
    const clientId = params.get('client_id');
    const redirectUri = params.get('redirect_uri');
    const responseType = params.get('response_type');
    const scope = params.get('scope');

    if (!clientId) {
      return { error: 'invalid_request', error_description: 'client_id is required' };
    }

    if (!redirectUri) {
      return { error: 'invalid_request', error_description: 'redirect_uri is required' };
    }

    if (!responseType) {
      return { error: 'invalid_request', error_description: 'response_type is required' };
    }

    if (!this.SUPPORTED_RESPONSE_TYPES.includes(responseType)) {
      return { error: 'unsupported_response_type', error_description: 'Only "code" response type is supported' };
    }

    return null;
  }

  // Валидация параметров токена
  static validateTokenParams(params: URLSearchParams): OAuthError | null {
    const grantType = params.get('grant_type');
    const clientId = params.get('client_id');
    const clientSecret = params.get('client_secret');

    if (!grantType) {
      return { error: 'invalid_request', error_description: 'grant_type is required' };
    }

    if (!this.SUPPORTED_GRANT_TYPES.includes(grantType)) {
      return { error: 'unsupported_grant_type', error_description: 'Only "authorization_code" and "refresh_token" grant types are supported' };
    }

    if (!clientId) {
      return { error: 'invalid_request', error_description: 'client_id is required' };
    }

    if (!clientSecret) {
      return { error: 'invalid_request', error_description: 'client_secret is required' };
    }

    return null;
  }

  // Получение OAuth приложения
  static async getApplication(clientId: string): Promise<any | null> {
    await connectDB();
    return await OAuthApplication.findOne({ clientId, isActive: true });
  }

  // Валидация redirect URI
  static validateRedirectUri(application: any, redirectUri: string): boolean {
    return application.redirectUris.includes(redirectUri);
  }

  // Валидация scope
  static validateScope(application: any, requestedScopes: string[]): string[] {
    const validScopes = requestedScopes.filter(scope => 
      application.scopes.includes(scope) || this.DEFAULT_SCOPES.includes(scope)
    );
    return validScopes.length > 0 ? validScopes : this.DEFAULT_SCOPES;
  }

  // Создание кода авторизации
  static async createAuthorizationCode(
    userId: string,
    clientId: string,
    redirectUri: string,
    scopes: string[]
  ): Promise<string> {
    await connectDB();

    const code = new OAuthCode({
      code: this.generateAuthCode(),
      userId,
      clientId,
      redirectUri,
      scopes,
      expiresAt: new Date(Date.now() + this.CODE_EXPIRES_IN * 1000),
    });

    await code.save();
    return code.code;
  }

  // Генерация кода авторизации
  private static generateAuthCode(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Обмен кода на токен
  static async exchangeCodeForToken(
    code: string,
    clientId: string,
    redirectUri: string
  ): Promise<OAuthTokenResponse | OAuthError> {
    await connectDB();

    const authCode = await OAuthCode.findOne({
      code,
      clientId,
      redirectUri,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!authCode) {
      return { error: 'invalid_grant', error_description: 'Invalid or expired authorization code' };
    }

    // Помечаем код как использованный
    authCode.isUsed = true;
    await authCode.save();

    // Создаем токены
    const accessToken = this.generateAccessToken(authCode.userId, clientId, authCode.scopes);
    const refreshToken = this.generateRefreshToken(authCode.userId, clientId, authCode.scopes);

    // Сохраняем токены в базе
    const token = new OAuthToken({
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + this.ACCESS_TOKEN_EXPIRES_IN * 1000),
      scopes: authCode.scopes,
      userId: authCode.userId,
      clientId,
    });

    await token.save();

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: this.ACCESS_TOKEN_EXPIRES_IN,
      refresh_token: refreshToken,
      scope: authCode.scopes.join(' '),
    };
  }

  // Обновление токена
  static async refreshAccessToken(
    refreshToken: string,
    clientId: string
  ): Promise<OAuthTokenResponse | OAuthError> {
    await connectDB();

    const token = await OAuthToken.findOne({
      refreshToken,
      clientId,
      isRevoked: false,
    });

    if (!token) {
      return { error: 'invalid_grant', error_description: 'Invalid refresh token' };
    }

    // Создаем новый access token
    const newAccessToken = this.generateAccessToken(token.userId, clientId, token.scopes);

    // Обновляем токен в базе
    token.accessToken = newAccessToken;
    token.expiresAt = new Date(Date.now() + this.ACCESS_TOKEN_EXPIRES_IN * 1000);
    await token.save();

    return {
      access_token: newAccessToken,
      token_type: 'Bearer',
      expires_in: this.ACCESS_TOKEN_EXPIRES_IN,
      refresh_token: refreshToken,
      scope: token.scopes.join(' '),
    };
  }

  // Валидация access token
  static async validateAccessToken(accessToken: string): Promise<{ userId: string; scopes: string[] } | null> {
    await connectDB();

    // Сначала проверяем JWT
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
      }

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET) as any;
      
      if (decoded.type !== 'access_token') {
        return null;
      }

      // Проверяем, что токен не отозван в базе
      const token = await OAuthToken.findOne({
        accessToken,
        isRevoked: false,
        expiresAt: { $gt: new Date() },
      });

      if (!token) {
        return null;
      }

      return {
        userId: decoded.sub,
        scopes: decoded.scopes,
      };
    } catch (error) {
      console.error('JWT validation error:', error);
      return null;
    }
  }

  // Получение информации о пользователе по токену
  static async getUserInfo(accessToken: string): Promise<any> {
    const tokenInfo = await this.validateAccessToken(accessToken);
    if (!tokenInfo) {
      return null;
    }

    await connectDB();
    const user = await User.findById(tokenInfo.userId);
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      misisLogin: user.misisLogin,
      misisData: user.misisData,
    };
  }

  // Генерация access token
  private static generateAccessToken(userId: string, clientId: string, scopes: string[]): string {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const payload = {
      sub: userId,
      client_id: clientId,
      scopes,
      type: 'access_token',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.ACCESS_TOKEN_EXPIRES_IN,
    };

    return jwt.sign(payload, process.env.JWT_SECRET);
  }

  // Генерация refresh token
  private static generateRefreshToken(userId: string, clientId: string, scopes: string[]): string {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const payload = {
      sub: userId,
      client_id: clientId,
      scopes,
      type: 'refresh_token',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.REFRESH_TOKEN_EXPIRES_IN,
    };

    return jwt.sign(payload, process.env.JWT_SECRET);
  }
}

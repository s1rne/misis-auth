import { NextRequest, NextResponse } from 'next/server';
import { OAuthServer } from '@/lib/oauth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'unauthorized', error_description: 'Bearer token required' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);

    console.log(accessToken);
    const tokenInfo = await OAuthServer.validateAccessToken(accessToken);

    if (!tokenInfo) {
      return NextResponse.json(
        { error: 'invalid_token', error_description: 'Invalid or expired access token' },
        { status: 401 }
      );
    }

    // Проверяем scope
    if (!tokenInfo.scopes.includes('profile')) {
      return NextResponse.json(
        { error: 'insufficient_scope', error_description: 'profile scope required' },
        { status: 403 }
      );
    }

    const userInfo = await OAuthServer.getUserInfo(accessToken);

    if (!userInfo) {
      return NextResponse.json(
        { error: 'user_not_found', error_description: 'User not found' },
        { status: 404 }
      );
    }

    // Возвращаем полный профиль
    return NextResponse.json({
      id: userInfo.id,
      email: userInfo.email,
      misisLogin: userInfo.misisLogin,
      fullName: userInfo.misisData?.fullName,
      recordBookNumber: userInfo.misisData?.recordBookNumber,
      studyForm: userInfo.misisData?.studyForm,
      preparationLevel: userInfo.misisData?.preparationLevel,
      specialization: userInfo.misisData?.specialization,
      specialty: userInfo.misisData?.specialty,
      faculty: userInfo.misisData?.faculty,
      course: userInfo.misisData?.course,
      group: userInfo.misisData?.group,
      financingForm: userInfo.misisData?.financingForm,
      dormitory: userInfo.misisData?.dormitory,
      endDate: userInfo.misisData?.endDate,
      personalEmail: userInfo.misisData?.personalEmail,
      personalPhone: userInfo.misisData?.personalPhone,
      corporateEmail: userInfo.misisData?.corporateEmail,
    });

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'Internal server error' },
      { status: 500 }
    );
  }
}

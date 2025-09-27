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
    const userInfo = await OAuthServer.getUserInfo(accessToken);

    if (!userInfo) {
      return NextResponse.json(
        { error: 'invalid_token', error_description: 'Invalid or expired access token' },
        { status: 401 }
      );
    }

    // Возвращаем информацию о пользователе
    return NextResponse.json({
      id: userInfo.id,
      email: userInfo.email,
      misisLogin: userInfo.misisLogin,
      profile: {
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
        personalEmail: userInfo.misisData?.personalEmail,
        personalPhone: userInfo.misisData?.personalPhone,
        corporateEmail: userInfo.misisData?.corporateEmail,
      },
    });

  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'Internal server error' },
      { status: 500 }
    );
  }
}

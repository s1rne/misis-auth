import { NextRequest, NextResponse } from 'next/server';
import { misisClient } from '@/lib/misis-client';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Проверяем, что запрос приходит от Vercel Cron или с правильным ключом
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Получаем всех пользователей с сохраненными паролями
    const users = await User.find({ 
      password: { $exists: true, $ne: null },
      isActive: true 
    });

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        // Обновляем данные из MISIS
        const misisData = await misisClient.getStudentInfo(
          user.misisLogin,
          user.password
        );

        // Обновляем пользователя
        user.misisData = misisData;
        await user.save();

        results.push({
          userId: user._id,
          misisLogin: user.misisLogin,
          status: 'success',
          updatedAt: new Date()
        });

        successCount++;

        // Небольшая задержка между запросами, чтобы не перегружать MISIS
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Ошибка обновления данных для пользователя ${user.misisLogin}:`, error);
        
        results.push({
          userId: user._id,
          misisLogin: user.misisLogin,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          updatedAt: new Date()
        });

        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Обновление данных завершено. Успешно: ${successCount}, Ошибок: ${errorCount}`,
      totalUsers: users.length,
      successCount,
      errorCount,
      results
    });

  } catch (error) {
    console.error('Ошибка cron job:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { misisClient } from '@/lib/misis-client';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    return NextResponse.json({ error: 'Not implemented' }, { status: 501 });

//   try {
//     const session = await getServerSession(authOptions);
    
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
//     }

//     await connectDB();
    
//     const user = await User.findById(session.user.id);
//     if (!user) {
//       return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
//     }

//     if (!user.password) {
//       return NextResponse.json({ 
//         error: 'У пользователя нет сохраненного пароля для обновления данных' 
//       }, { status: 400 });
//     }

//     // Обновляем данные из MISIS
//     const misisData = await misisClient.getStudentInfo(
//       user.misisLogin,
//       user.password
//     );

//     // Обновляем пользователя
//     user.misisData = misisData;
//     await user.save();

//     return NextResponse.json({
//       success: true,
//       message: 'Данные успешно обновлены',
//       data: misisData
//     });

//   } catch (error) {
//     console.error('Ошибка обновления данных:', error);
//     return NextResponse.json(
//       { error: 'Не удалось обновить данные из ЛК вуза' },
//       { status: 500 }
//     );
//   }
}

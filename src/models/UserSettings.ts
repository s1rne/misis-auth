import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSettings extends Document {
  _id: string;
  userId: string;
  
  // Настройки приложений
  maxApplications: number;
  
  // Будущие настройки можно легко добавлять здесь:
  // maxTokensPerApplication?: number;
  // allowedScopes?: string[];
  // sessionTimeout?: number;
  // twoFactorEnabled?: boolean;
  // emailNotifications?: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema = new Schema<IUserSettings>({
  userId: {
    type: String,
    required: true,
    unique: true,
    ref: 'User',
  },
  
  maxApplications: {
    type: Number,
    default: 5, // По умолчанию 5 приложений на пользователя
    min: 0,
  },
  
  // Будущие настройки
  // maxTokensPerApplication: {
  //   type: Number,
  //   default: 100,
  // },
  // allowedScopes: [{
  //   type: String,
  // }],
  // sessionTimeout: {
  //   type: Number,
  //   default: 3600, // 1 час в секундах
  // },
  // twoFactorEnabled: {
  //   type: Boolean,
  //   default: false,
  // },
  // emailNotifications: {
  //   type: Boolean,
  //   default: true,
  // },
  
}, {
  timestamps: true,
});

// Индексы
// UserSettingsSchema.index({ userId: 1 }); // Убираем, так как unique: true уже создает индекс

// Middleware для создания настроек по умолчанию при создании пользователя
// (это можно будет использовать в будущем)

// Очищаем кэш модели
if (mongoose.models.UserSettings) {
  console.log('🗑️ Удаляем модель UserSettings из кэша');
  delete mongoose.models.UserSettings;
// }
}

export default mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IAccessToken extends Document {
  _id: string;
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresAt: Date;
  scopes: string[];
  userId: string;
  clientId: string;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AccessTokenSchema = new Schema<IAccessToken>({
  accessToken: {
    type: String,
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    unique: true,
    sparse: true, // Позволяет null значения, но требует уникальности для не-null
  },
  tokenType: {
    type: String,
    default: 'Bearer',
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  scopes: [{
    type: String,
    required: true,
  }],
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  clientId: {
    type: String,
    required: true,
    ref: 'Application',
  },
  isRevoked: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Индексы для быстрого поиска
// AccessTokenSchema.index({ accessToken: 1 }); // unique: true уже создает индекс
// AccessTokenSchema.index({ refreshToken: 1 }); // unique: true уже создает индекс
AccessTokenSchema.index({ userId: 1 });
AccessTokenSchema.index({ clientId: 1 });
// AccessTokenSchema.index({ isRevoked: 1 });

// TTL индекс для автоматического удаления истекших токенов
AccessTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Токены генерируются в OAuthServer, middleware удален

// Очищаем кэш модели, чтобы убрать старые middleware
// if (mongoose.models.AccessToken) {
//   delete mongoose.models.AccessToken;
// }

export default mongoose.model<IAccessToken>('AccessToken', AccessTokenSchema);
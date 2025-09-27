import mongoose, { Document, Schema } from 'mongoose';

export interface IOAuthToken extends Document {
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

const OAuthTokenSchema = new Schema<IOAuthToken>({
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
    ref: 'OAuthApplication',
  },
  isRevoked: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Индексы для быстрого поиска
// OAuthTokenSchema.index({ accessToken: 1 });
// OAuthTokenSchema.index({ refreshToken: 1 });
OAuthTokenSchema.index({ userId: 1 });
OAuthTokenSchema.index({ clientId: 1 });
OAuthTokenSchema.index({ expiresAt: 1 });
// OAuthTokenSchema.index({ isRevoked: 1 });

// TTL индекс для автоматического удаления истекших токенов
OAuthTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Токены генерируются в OAuthServer, middleware удален

// Очищаем кэш модели, чтобы убрать старые middleware
if (mongoose.models.OAuthToken) {
  delete mongoose.models.OAuthToken;
}

export default mongoose.model<IOAuthToken>('OAuthToken', OAuthTokenSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IOAuthCode extends Document {
  _id: string;
  code: string;
  userId: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

const OAuthCodeSchema = new Schema<IOAuthCode>({
  code: {
    type: String,
    required: true,
    unique: true,
  },
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
  redirectUri: {
    type: String,
    required: true,
  },
  scopes: [{
    type: String,
    required: true,
  }],
  expiresAt: {
    type: Date,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Индексы
OAuthCodeSchema.index({ code: 1 });
OAuthCodeSchema.index({ userId: 1 });
OAuthCodeSchema.index({ clientId: 1 });
OAuthCodeSchema.index({ expiresAt: 1 });
OAuthCodeSchema.index({ isUsed: 1 });

// TTL индекс для автоматического удаления истекших кодов
OAuthCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


export default mongoose.models.OAuthCode || mongoose.model<IOAuthCode>('OAuthCode', OAuthCodeSchema);

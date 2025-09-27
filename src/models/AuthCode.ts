import mongoose, { Document, Schema } from 'mongoose';

export interface IAuthCode extends Document {
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

const AuthCodeSchema = new Schema<IAuthCode>({
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
    ref: 'Application',
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
AuthCodeSchema.index({ userId: 1 });
AuthCodeSchema.index({ clientId: 1 });
AuthCodeSchema.index({ isUsed: 1 });

// TTL индекс для автоматического удаления истекших кодов
AuthCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


export default mongoose.models.AuthCode || mongoose.model<IAuthCode>('AuthCode', AuthCodeSchema);

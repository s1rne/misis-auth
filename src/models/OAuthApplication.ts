import mongoose, { Document, Schema } from 'mongoose';

export interface IOAuthApplication extends Document {
  _id: string;
  name: string;
  description?: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  scopes: string[];
  ownerId: string; // ID пользователя-владельца
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OAuthApplicationSchema = new Schema<IOAuthApplication>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  clientId: {
    type: String,
    required: true,
    unique: true,
  },
  clientSecret: {
    type: String,
    required: true,
  },
  redirectUris: [{
    type: String,
    required: true,
  }],
  scopes: [{
    type: String,
    required: true,
  }],
  ownerId: {
    type: String,
    required: true,
    ref: 'User',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Индексы
// OAuthApplicationSchema.index({ clientId: 1 });
OAuthApplicationSchema.index({ ownerId: 1 });
OAuthApplicationSchema.index({ isActive: 1 });

// Генерация clientId и clientSecret
OAuthApplicationSchema.pre('save', async function(next) {
  if (this.isNew && !this.clientId) {
    this.clientId = await generateUniqueClientId();
  }
  if (this.isNew && !this.clientSecret) {
    this.clientSecret = generateClientSecret();
  }
  next();
});

async function generateUniqueClientId(): Promise<string> {
  let clientId: string;
  let isUnique = false;
  
  while (!isUnique) {
    clientId = 'misis_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Проверяем уникальность
    const existing = await mongoose.models.OAuthApplication?.findOne({ clientId });
    if (!existing) {
      isUnique = true;
      return clientId;
    }
  }
  
  return clientId!;
}

function generateClientSecret(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default mongoose.models.OAuthApplication || mongoose.model<IOAuthApplication>('OAuthApplication', OAuthApplicationSchema);

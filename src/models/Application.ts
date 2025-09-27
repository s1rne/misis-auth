import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IApplication extends Document {
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

// Интерфейс для статических методов
export interface IApplicationModel extends Model<IApplication> {
  createWithGeneratedCredentials(data: Partial<IApplication>): Promise<IApplication>;
}

const ApplicationSchema = new Schema<IApplication>({
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
ApplicationSchema.index({ ownerId: 1 });
ApplicationSchema.index({ isActive: 1 });

// Генерация clientId и clientSecret при валидации (вызывается при new Application)
ApplicationSchema.pre('validate', async function(next) {
  console.log("ApplicationSchema.pre('validate') - генерация credentials");
  if (this.isNew && !this.clientId) {
    this.clientId = await generateUniqueClientId();
    console.log("Generated clientId:", this.clientId);
  }
  if (this.isNew && !this.clientSecret) {
    this.clientSecret = generateClientSecret();
    console.log("Generated clientSecret:", this.clientSecret ? "***" : "не сгенерирован");
  }
  next();
});

async function generateUniqueClientId(): Promise<string> {
  let clientId: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isUnique && attempts < maxAttempts) {
    clientId = 'misis_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Проверяем уникальность
    const existing = await mongoose.models.Application?.findOne({ clientId });
    if (!existing) {
      isUnique = true;
      return clientId;
    }
    attempts++;
  }
  
  throw new Error('Не удалось сгенерировать уникальный clientId');
}

function generateClientSecret(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Статический метод для удобного создания приложения
ApplicationSchema.statics.createWithGeneratedCredentials = async function(data: Partial<IApplication>): Promise<IApplication> {
  const application = new this(data);
  // Поля clientId и clientSecret будут автоматически сгенерированы в pre('validate') хуке
  return application;
};

// Очистка кэша модели для перезагрузки схемы
// if (mongoose.models.Application) {
//   delete mongoose.models.Application;
// }

export default mongoose.model<IApplication, IApplicationModel>('Application', ApplicationSchema);
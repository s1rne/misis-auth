import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password?: string;
  misisLogin: string;
  misisData?: {
    fullName: string;
    recordBookNumber: string;
    studyForm: string;
    preparationLevel: string;
    specialization: string;
    specialty: string;
    faculty: string;
    course: string;
    group: string;
    financingForm: string;
    dormitory: string;
    endDate: string;
    personalEmail: string;
    personalPhone: string;
    corporateEmail: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: false, // Исходный пароль для работы с MISIS API
  },
  misisLogin: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  misisData: {
    fullName: String,
    recordBookNumber: String,
    studyForm: String,
    preparationLevel: String,
    specialization: String,
    specialty: String,
    faculty: String,
    course: String,
    group: String,
    financingForm: String,
    dormitory: String,
    endDate: String,
    personalEmail: String,
    personalPhone: String,
    corporateEmail: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Индексы для быстрого поиска
// UserSchema.index({ email: 1 });
// UserSchema.index({ misisLogin: 1 });
UserSchema.index({ isActive: 1 });

// Метод для сравнения паролей (простое сравнение строк)
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return this.password === candidatePassword;
};

// Очищаем кэш модели, чтобы убрать старые middleware
// if (mongoose.models.User) {
//   delete mongoose.models.User;
// }

// export default mongoose.model<IUser>('User', UserSchema);
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
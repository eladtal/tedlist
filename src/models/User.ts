import mongoose, { Types } from 'mongoose';

export interface Quest {
  id: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
}

export interface TradingSession {
  activeItemId?: Types.ObjectId;
  startedAt?: Date;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  teddies: number;
  badges: string[];
  streak: {
    count: number;
    lastLogin: Date;
  };
  onboardingProgress: number;
  quests: Quest[];
  tradingSession?: TradingSession;
  swipedItems: string[];
  teddyTransactions: {
    amount: number;
    description: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    avatar: {
      type: String,
    },
    teddies: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
    streak: {
      count: {
        type: Number,
        default: 0,
      },
      lastLogin: {
        type: Date,
        default: null,
      },
    },
    onboardingProgress: {
      type: Number,
      default: 0,
    },
    quests: {
      type: [
        {
          id: String,
          progress: Number,
          completed: Boolean,
          completedAt: Date,
        },
      ],
      default: [],
    },
    tradingSession: {
      activeItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
      startedAt: {
        type: Date,
      },
    },
    swipedItems: {
      type: [String],
      default: [],
    },
    teddyTransactions: {
      type: [
        {
          amount: Number,
          description: String,
          timestamp: Date,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema); 
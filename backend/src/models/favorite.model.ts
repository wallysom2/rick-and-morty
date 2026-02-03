import mongoose, { Schema, Document } from 'mongoose';
import type { CharacterStatus } from '../types/index.js';

export interface IFavorite extends Document {
  characterId: number;
  name: string;
  image: string;
  species: string;
  status: CharacterStatus;
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    characterId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Alive', 'Dead', 'unknown'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
favoriteSchema.index({ name: 'text' });

export const FavoriteModel = mongoose.model<IFavorite>('Favorite', favoriteSchema);

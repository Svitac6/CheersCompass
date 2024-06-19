import mongoose from "mongoose"
import { Bar } from './Bar.js';
import { User } from './User.js';

const favoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    bar: { type: mongoose.Schema.Types.ObjectId, ref: Bar, required: true },

}, { timestamps: true });

const FavModel = mongoose.model('Favorite', favoriteSchema);
export { FavModel as Favorite };

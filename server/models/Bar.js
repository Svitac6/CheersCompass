import mongoose from 'mongoose';
import { BarType } from './Type.js';

const BarSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    rating:{type: Number},
    numRating:{type: Number},
    types: [{ type: mongoose.Schema.Types.ObjectId, ref: BarType, required: true }],
    opening_hours: { type: String, required: true },
    closing_hours: { type: String, required: true },
    average_rating: { type: Number, default: 0 },
    image: { type: String }, // Field for storing image path
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware to update the updated_at field on save
BarSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});




const BarModel = mongoose.model('Bar', BarSchema);
export { BarModel as Bar };

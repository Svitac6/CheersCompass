import mongoose from 'mongoose';
import { BarType } from './Type';  

const BarSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    types: [{ type: mongoose.Schema.Types.ObjectId, ref: BarType , required: true }],
    opening_hours: { type: String, required: true },
    closing_hours: { type: String, required: true },
    average_rating: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const BarModel = mongoose.model('Bar', BarSchema);
export { BarModel as Bar };

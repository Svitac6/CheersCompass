import mongoose from "mongoose"

const ReviewSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bar_id: { type: Schema.Types.ObjectId, ref: 'Bar', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})
  
const ReviewModel = mongoose.model('Review', ReviewSchema);
export {ReviewModel as Review}
  
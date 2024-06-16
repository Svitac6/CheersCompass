import mongoose from 'mongoose';

const BarTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

const BarTypeModel = mongoose.model('BarType', BarTypeSchema);
export { BarTypeModel as BarType };

import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  provider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  availability: [{ type: String, enum: ['available', 'unavailable'] }],
  image: { type: String },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
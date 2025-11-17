import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const reservationSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: () => nanoid(),
    },
    customerName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: false,
  },
);

reservationSchema.index({ tableNumber: 1, date: 1 });

export default mongoose.model('Reservation', reservationSchema);

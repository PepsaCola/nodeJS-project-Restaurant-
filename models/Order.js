import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    menu_id: {
      type: String,
      ref: 'Dish',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    employee_id: {
      type: String,
      required: true,
    },
    items: [orderItemSchema],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: false,
  },
);

export default mongoose.model('Order', orderSchema);

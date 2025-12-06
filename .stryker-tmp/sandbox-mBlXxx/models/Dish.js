// @ts-nocheck
import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true,
    },
    dishName: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    price: Number,
  },
  {
    _id: false,
  },
);

export default mongoose.model('Dish', dishSchema);

import OrderService from '../services/order.js';

const getAllHistory = async (req, res) => {
  try {
    const history = await OrderService.getAllHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPopularDishes = async (req, res) => {
  try {
    const popularDishes = await OrderService.getPopularDishes();
    res.json(popularDishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllHistory,
  getPopularDishes,
};

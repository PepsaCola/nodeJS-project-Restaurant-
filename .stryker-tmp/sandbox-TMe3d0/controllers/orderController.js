// @ts-nocheck
import OrderService from '../services/order.js';

const getAllHistory = async (req, res) => {
  try {
    const history = await OrderService.getAllHistory();
    res.json({ orders: history });
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

const getAllActiveOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAllActiveOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося зчитати список замовлень.' });
  }
};

const createOrder = async (req, res) => {
  try {
    const newOrder = await OrderService.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Помилка створення замовлення.' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await OrderService.updateOrderStatus(id, status);
    res.json(updatedOrder);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Помилка оновлення статусу.' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await OrderService.deleteOrder(id);
    res.status(204).send();
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Помилка видалення замовлення.' });
  }
};

export default {
  getAllHistory,
  getPopularDishes,
  getAllActiveOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};

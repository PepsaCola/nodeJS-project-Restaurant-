import { nanoid } from 'nanoid';
import Order from '../models/Order.js';
import Dish from '../models/Dish.js';

const defaultEmployee = 'E101';

const getAllHistory = async () => {
  try {
    return await Order.find()
      .populate('items.menu_id', 'dishName price')
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error('Помилка у сервісі getAllHistory:', error);
    throw new Error('Не вдалося отримати історію замовлень');
  }
};

const getPopularDishes = async () => {
  try {
    return await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menu_id',
          totalQuantity: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      {
        $lookup: {
          from: 'dishes',
          localField: '_id',
          foreignField: '_id',
          as: 'dishDetails',
        },
      },
      { $unwind: '$dishDetails' },
      {
        $project: {
          _id: 0,
          menu_id: '$_id',
          dishName: '$dishDetails.dishName',
          totalQuantity: '$totalQuantity',
        },
      },
    ]);
  } catch (error) {
    console.error('Помилка у сервісі getPopularDishes:', error);
    throw new Error('Не вдалося розрахувати популярні страви');
  }
};

const getAllActiveOrders = async () => {
  try {
    return await Order.find({ status: 'active' })
      .populate('items.menu_id', 'dishName price')
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error('Помилка у сервісі getAllActiveOrders:', error);
    throw new Error('Не вдалося отримати активні замовлення');
  }
};

const createOrder = async (orderBody) => {
  const { customerName, items } = orderBody;

  if (!customerName || !items || items.length === 0) {
    const err = new Error('Потрібні ім’я клієнта та позиції замовлення.');
    err.statusCode = 400;
    throw err;
  }
  const menuIds = items.map((item) => item.menu_id);
  const menuItems = await Dish.find({ _id: { $in: menuIds } });
  const menuMap = new Map(menuItems.map((dish) => [dish._id, dish]));

  let totalPrice = 0;
  const orderItems = [];
  for (const item of items) {
    const menuItem = menuMap.get(item.menu_id);
    if (!menuItem) {
      const err = new Error(`Страва з ID ${item.menu_id} не знайдена.`);
      err.statusCode = 404;
      throw err;
    }
    totalPrice += menuItem.price * item.quantity;
    orderItems.push({ menu_id: item.menu_id, quantity: item.quantity });
  }
  const newOrder = {
    _id: nanoid(),
    customerName,
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    status: 'active',
    employee_id: defaultEmployee,
    items: orderItems,
  };

  return Order.create(newOrder);
};

const updateOrderStatus = async (orderId, newStatus) => {
  if (!newStatus || !['active', 'completed'].includes(newStatus)) {
    const err = new Error('Недійсний статус. Можливі: "active", "completed".');
    err.statusCode = 400;
    throw err;
  }
  const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });

  if (!updatedOrder) {
    const err = new Error('Активне замовлення не знайдено.');
    err.statusCode = 404;
    throw err;
  }
  return updatedOrder;
};

const deleteOrder = async (orderId) => {
  const deletedOrder = await Order.findOneAndDelete({
    _id: orderId,
    status: 'completed',
  });

  if (!deletedOrder) {
    const err = new Error(
      'Замовлення не знайдено або не має статусу "completed".'
    );
    err.statusCode = 404;
    throw err;
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

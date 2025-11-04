import menu from '../data/menu.js';
import history from '../data/history.js';
import { data as orderData } from '../data/order.js';
const employees = [{ _id: 'E101', name: 'Офіціант 1' }];

const getAllOrders = (req, res) => {
  res.json(orderData.orders);
};

const createOrder = (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Тіло запиту відсутнє.' });
  }

  const { customerName, items } = req.body;

  if (!customerName || !items || items.length === 0) {
    return res.status(400).json({ error: 'Потрібні ім’я клієнта та позиції замовлення.' });
  }

  let totalPrice = 0;
  const orderItems = [];
  let isValidOrder = true;

  for (const item of items) {
    const menuItem = menu.find((dish) => String(dish._id) === String(item.menu_id));
    if (!menuItem) {
      isValidOrder = false;
      break;
    }
    totalPrice += menuItem.price * item.quantity;
    orderItems.push({ menu_id: item.menu_id, quantity: item.quantity });
  }

  if (!isValidOrder) {
    return res.status(404).json({ error: 'Одна або кілька позицій меню не знайдені.' });
  }

  const newOrder = {
    _id: String(orderData.orderCounter),
    customerName: customerName,
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    status: 'active',
    employee_id: employees[0]._id,
    items: orderItems,
    createdAt: new Date().toISOString(),
  };

  orderData.orders.push(newOrder);
  orderData.orderCounter++;
  res.status(201).json(newOrder);
};

const updateOrderStatus = (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const orderIndex = orderData.orders.findIndex((o) => String(o._id) === String(orderId));

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Активне замовлення не знайдено.' });
  }

  if (status && (status === 'active' || status === 'completed')) {
    orderData.orders[orderIndex].status = status;

    if (status === 'completed') {
      const completedOrder = {
        ...orderData.orders[orderIndex],
        date: new Date().toISOString(),
      };
      history.push(completedOrder);
    }
    return res.json(orderData.orders[orderIndex]);
  }

  return res.status(400).json({ error: 'Недійсний статус. Можливі: "active", "completed".' });
};

const deleteOrder = (req, res) => {
  const orderId = req.params.id;
  const orderIndex = orderData.orders.findIndex((o) => String(o._id) === String(orderId));

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Замовлення не знайдено в активних.' });
  }

  const order = orderData.orders[orderIndex];

  if (order.status !== 'completed') {
    return res
      .status(400)
      .json({ error: 'Можна видалити лише замовлення зі статусом "completed".' });
  }

  orderData.orders.splice(orderIndex, 1);

  res.status(204).send();
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};

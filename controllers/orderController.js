import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const employees = [{ _id: 'E101', name: 'Офіціант 1' }];

const menuPath = path.join(__dirname, '../data/menu.json');
const historyPath = path.join(__dirname, '../data/history.json');
const orderPath = path.join(__dirname, '../data/orders.json');

const readJSON = async (filePath) => {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

const writeJSON = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};


const getAllOrders = async (req, res) => {
  try {
    const orderData = await readJSON(orderPath);
    res.json(orderData.orders);
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося зчитати список замовлень.' });
  }
};

const createOrder = async (req, res) => {
  try {
    const [orderData, menu] = await Promise.all([
      readJSON(orderPath),
      readJSON(menuPath),
    ]);

    if (!req.body) {
      return res.status(400).json({ error: 'Тіло запиту відсутнє.' });
    }

    const { customerName, items } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res
        .status(400)
        .json({ error: 'Потрібні ім’я клієнта та позиції замовлення.' });
    }

    let totalPrice = 0;
    const orderItems = [];
    let isValidOrder = true;

    for (const item of items) {
      const menuItem = menu.find(
        (dish) => String(dish._id) === String(item.menu_id)
      );
      if (!menuItem) {
        isValidOrder = false;
        break;
      }
      totalPrice += menuItem.price * item.quantity;
      orderItems.push({ menu_id: item.menu_id, quantity: item.quantity });
    }

    if (!isValidOrder) {
      return res
        .status(404)
        .json({ error: 'Одна або кілька позицій меню не знайдені.' });
    }

    const newOrder = {
      _id: nanoid(),
      customerName,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      status: 'active',
      employee_id: employees[0]._id,
      items: orderItems,
      createdAt: new Date().toISOString(),
    };

    orderData.orders.push(newOrder);

    await writeJSON(orderPath, orderData);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Помилка створення замовлення.' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const [orderData, history] = await Promise.all([
      readJSON(orderPath),
      readJSON(historyPath),
    ]);

    const orderId = req.params.id;
    const { status } = req.body;

    const orderIndex = orderData.orders.findIndex(
      (o) => String(o._id) === String(orderId)
    );

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Активне замовлення не знайдено.' });
    }

    if (status && (status === 'active' || status === 'completed')) {
      orderData.orders[orderIndex].status = status;

      const writePromises = [writeJSON(orderPath, orderData)];

      if (status === 'completed') {
        const completedOrder = {
          ...orderData.orders[orderIndex],
          date: new Date().toISOString(),
        };
        history.push(completedOrder);
        writePromises.push(writeJSON(historyPath, history));
      }

      await Promise.all(writePromises);

      return res.json(orderData.orders[orderIndex]);
    }

    return res
      .status(400)
      .json({ error: 'Недійсний статус. Можливі: "active", "completed".' });
  } catch (error) {
    res.status(500).json({ error: 'Помилка оновлення статусу замовлення.' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderData = await readJSON(orderPath);
    const orderId = req.params.id;

    const orderIndex = orderData.orders.findIndex(
      (o) => String(o._id) === String(orderId)
    );

    if (orderIndex === -1) {
      return res
        .status(404)
        .json({ error: 'Замовлення не знайдено в активних.' });
    }

    const order = orderData.orders[orderIndex];

    if (order.status !== 'completed') {
      return res
        .status(400)
        .json({ error: 'Можна видалити лише замовлення зі статусом "completed".' });
    }

    orderData.orders.splice(orderIndex, 1);
    await writeJSON(orderPath, orderData);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Помилка видалення замовлення.' });
  }
};

export default {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
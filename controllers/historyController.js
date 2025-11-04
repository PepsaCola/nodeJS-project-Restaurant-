import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const historyPath = path.join(__dirname, '../data/history.json');
const menuPath = path.join(__dirname, '../data/menu.json');

const readJSON = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const getAllHistory = (req, res) => {
  try {
    const history = readJSON(historyPath);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося зчитати історію замовлень' });
  }
};

const getPopularDishes = (req, res) => {
  try {
    const history = readJSON(historyPath);
    const menu = readJSON(menuPath);
    const dishCounts = {};

    history.forEach((order) => {
      order.items.forEach((item) => {
        const { menu_id, quantity } = item;
        dishCounts[menu_id] = (dishCounts[menu_id] || 0) + quantity;
      });
    });

    const popularDishes = Object.keys(dishCounts)
      .map((menu_id) => {
        const dish = menu.find((d) => d._id === menu_id);
        return {
          menu_id: menu_id,
          dishName: dish ? dish.dishName : 'Невідома страва',
          totalQuantity: dishCounts[menu_id],
        };
      })
      .sort((a, b) => b.totalQuantity - a.totalQuantity);

    res.json(popularDishes);
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося зчитати дані' });
  }
};

export default {
  getAllHistory,
  getPopularDishes,
};
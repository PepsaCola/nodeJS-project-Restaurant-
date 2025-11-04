import history from '../data/history.json';
import menu from '../data/menu.json';

const getAllHistory = (req, res) => {
  res.json(history);
};

const getPopularDishes = (req, res) => {
  const dishCounts = {};

  // Імітація. Перебір історії та підрахунок кількості замовлених страв
  history.forEach((order) => {
    order.items.forEach((item) => {
      const { menu_id, quantity } = item;
      dishCounts[menu_id] = (dishCounts[menu_id] || 0) + quantity;
    });
  });

  // Форматування результату з додаванням назв страв
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
};

module.exports = {
  getAllHistory,
  getPopularDishes,
};

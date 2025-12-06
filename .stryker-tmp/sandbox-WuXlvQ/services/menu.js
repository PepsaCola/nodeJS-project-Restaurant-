// @ts-nocheck
import Dish from '../models/Dish.js';

const getMenu = async () => {
  try {
    const menu = await Dish.find();
    return menu;
  } catch (error) {
    console.error('Помилка у сервісі getMenu:', error);
    throw new Error('Не вдалося отримати меню з бази даних');
  }
};

export default {
  getMenu,
};
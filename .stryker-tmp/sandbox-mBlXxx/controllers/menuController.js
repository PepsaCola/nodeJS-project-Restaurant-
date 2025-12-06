// @ts-nocheck
import MenuService from '../services/menu.js';

const getMenu = async (req, res) => {
  try {
    const menu = await MenuService.getMenu();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getMenu,
};

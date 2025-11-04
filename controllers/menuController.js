import menu from '../data/menu.json';

const getMenu = (req, res) => {
  res.json(menu);
};

module.exports = {
  getMenu,
};

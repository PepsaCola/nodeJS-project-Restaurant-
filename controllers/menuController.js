import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const menuPath = path.join(__dirname, '../data/menu.json');

const readJSON = async (filePath) => {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

const getMenu = async (req, res) => {
  try {
    const menu = await readJSON(menuPath);
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося зчитати меню' });
  }
};

export default {
  getMenu,
};
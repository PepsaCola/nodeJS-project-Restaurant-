import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const reservationPath = path.join(__dirname, '../data/reservation.json');

const readJSON = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

const createReservation = (req, res) => {
  try {
    const reservationData = readJSON(reservationPath);
    const { reservations, max_tables } = reservationData;
    const { customerName, date, tableNumber } = req.body;

    if (!customerName || !date || !tableNumber) {
      return res.status(400).json({ error: 'Потрібні ім’я клієнта, дата та номер столика.' });
    }

    if (tableNumber < 1 || tableNumber > max_tables) {
      return res
        .status(400)
        .json({ error: `Столика №${tableNumber} не існує. Макс. №: ${max_tables}` });
    }

    const reservationDate = new Date(date);
    const reservationTime = reservationDate.getTime();

    const isReserved = reservations.some((r) => {
      if (Number(r.tableNumber) !== Number(tableNumber)) {
        return false;
      }
      const existingTime = new Date(r.date).getTime();
      return Math.abs(reservationTime - existingTime) < 7200000;
    });

    if (isReserved) {
      return res.status(409).json({ error: `Стіл №${tableNumber} вже заброньовано на цей час.` });
    }

    const newReservation = {
      _id: nanoid(),
      customerName,
      date: reservationDate.toISOString(),
      tableNumber,
      createdAt: new Date().toISOString(),
    };

    reservations.push(newReservation);
    writeJSON(reservationPath, reservationData);

    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ error: 'Помилка створення бронювання.' });
  }
};

export default {
  createReservation,
};
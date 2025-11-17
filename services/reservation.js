import Reservation from '../models/Reservation.js';

const MAX_TABLES = 10;

const RESERVATION_WINDOW_MS = 7200000;

const createReservation = async (reservationBody) => {
  const { customerName, date, tableNumber } = reservationBody;
  if (!customerName || !date || !tableNumber) {
    const err = new Error('Потрібні ім’я клієнта, дата та номер столика.');
    err.statusCode = 400;
    throw err;
  }
  if (tableNumber < 1 || tableNumber > MAX_TABLES) {
    const err = new Error(`Столика №${tableNumber} не існує. Макс. №: ${MAX_TABLES}`);
    err.statusCode = 400;
    throw err;
  }

  const reservationDate = new Date(date);
  const conflictWindowStart = new Date(reservationDate.getTime() - RESERVATION_WINDOW_MS);
  const conflictWindowEnd = new Date(reservationDate.getTime() + RESERVATION_WINDOW_MS);
  const existingReservation = await Reservation.findOne({
    tableNumber: tableNumber,
    date: {
      $gte: conflictWindowStart,
      $lt: conflictWindowEnd,
    },
  });
  if (existingReservation) {
    const err = new Error(`Стіл №${tableNumber} вже заброньовано на цей час.`);
    err.statusCode = 409;
    throw err;
  }

  const newReservation = await Reservation.create({
    customerName,
    date: reservationDate.toISOString(),
    tableNumber,
  });

  return newReservation;
};

export default {
  createReservation,
};

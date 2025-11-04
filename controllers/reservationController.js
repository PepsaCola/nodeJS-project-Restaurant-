import reservationData from '../data/reservationData.js';
const { reservations, max_tables } = reservationData;

const createReservation = (req, res) => {
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
    _id: 'R' + reservationData.reservationCounter++,
    customerName: customerName,
    date: reservationDate.toISOString(),
    tableNumber: tableNumber,
    createdAt: new Date().toISOString(),
  };

  reservationData.reservations.push(newReservation);
  res.status(201).json(newReservation);
};

module.exports = {
  createReservation,
};

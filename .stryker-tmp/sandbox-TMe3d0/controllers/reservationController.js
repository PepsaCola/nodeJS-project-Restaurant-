// @ts-nocheck
import ReservationService from '../services/reservation.js';

const createReservation = async (req, res) => {
  try {
    const newReservation = await ReservationService.createReservation(req.body);
    res.status(201).json(newReservation);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || 'Помилка створення бронювання.' });
  }
};

export default {
  createReservation,
};

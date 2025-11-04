import express from 'express';
import reservationController from '../controllers/reservationController.js';

const reservationsRouter = express.Router();

reservationsRouter.post('/', reservationController.createReservation)

export default reservationsRouter;
import express from 'express';
import historyController from '../controllers/historyController.js';

const historyRouter = express.Router();

historyRouter.get('/', historyController.getAllHistory)
historyRouter.get('/popular-dishes',historyController.getPopularDishes)

export default historyRouter;
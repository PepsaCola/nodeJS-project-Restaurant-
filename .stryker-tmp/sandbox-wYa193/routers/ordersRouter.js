// @ts-nocheck
import express from 'express';
import orderController from '../controllers/orderController.js';

const ordersRouter = express.Router();

ordersRouter.get('/', orderController.getAllActiveOrders);
ordersRouter.post('/', orderController.createOrder);
ordersRouter.put('/:id', orderController.updateOrderStatus);
ordersRouter.delete('/:id', orderController.deleteOrder);

export default ordersRouter;
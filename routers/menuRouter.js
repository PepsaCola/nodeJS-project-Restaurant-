import express from 'express';
import menuController from '../controllers/menuController.js';

const menuRouter = express.Router();

menuRouter.get('/', menuController.getMenu);

export default menuRouter;

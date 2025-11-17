import cors from 'cors';
import express from 'express';
import reservationsRouter from './routers/reservationsRouter.js';
import ordersRouter from './routers/ordersRouter.js';
import menuRouter from './routers/menuRouter.js';
import historyRouter from './routers/historyRouter.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/menu', menuRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/history', historyRouter);

app.use((_, res) => {
  res.status(404).send('Route not found');
});

app.use(( err  , req , res , next ) => {
  const {status = 500, message = 'Server error'} = err;
  res.status(status).json({message});
});

export default app;

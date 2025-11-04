import express from 'express';

import menuRouter from './routers/menuRouter.js';
import ordersRouter from './routers/ordersRouter.js';
import reservationsRouter from './routers/reservationsRouter.js';
import historyRouter from './routers/historyRouter.js';
const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/menu',menuRouter)
app.use('/api/orders',ordersRouter)
app.use('/api/reservations',reservationsRouter)
app.use('/api/history',historyRouter)

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

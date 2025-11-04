import express from 'express';
import menuController from './controllers/menuController.js';
import historyController from './controllers/historyController.js';
import orderController from './controllers/orderController.js';
import reservationController from './controllers/reservationController.js';
const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/menu', menuController.getMenu);

app.get('/api/history', historyController.getAllHistory);
app.get('/api/analytics/popular-dishes', historyController.getPopularDishes);

app.get('/api/orders', orderController.getAllOrders);
app.post('/api/create-orders', orderController.createOrder);
app.put('/api/orders/:id', orderController.updateOrderStatus);
app.delete('/api/orders/:id', orderController.deleteOrder);

app.post('/api/reservations', reservationController.createReservation);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

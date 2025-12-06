// @ts-nocheck
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../app.js';
import Dish from '../../models/Dish.js'; // Переконайтесь, що шлях правильний
import Order from '../../models/Order.js';

let mongoServer;

describe('Order API Integration Tests', () => {
  // 1. Запускаємо віртуальну БД перед усіма тестами
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  // 2. Очищаємо дані після кожного тесту
  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  // 3. Закриваємо з'єднання після всіх тестів
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('POST /api/orders - повинен створити замовлення і зберегти в БД', async () => {
    // Спочатку створюємо страву в БД, бо замовлення посилається на неї
    const dish = await Dish.create({
      dishName: 'Pizza',
      price: 150,
      category: 'Main',
      image: 'img.jpg',
      ingredients: ['dough', 'cheese']
    });

    const newOrderData = {
      customerName: 'Integration Tester',
      items: [{ menu_id: dish._id.toString(), quantity: 2 }]
    };

    const res = await request(app)
      .post('/api/orders')
      .send(newOrderData);

    expect(res.statusCode).toBe(201);
    expect(res.body.customerName).toBe('Integration Tester');
    expect(res.body.totalPrice).toBe(300); // 150 * 2
    expect(res.body.status).toBe('active');

    // Перевіряємо, чи дійсно записалось у базу
    const orderInDb = await Order.findById(res.body._id);
    expect(orderInDb).toBeTruthy();
  });

  it('GET /api/orders - повинен повернути список активних замовлень', async () => {
    // Створюємо тестове замовлення прямо в БД
    const dish = await Dish.create({ dishName: 'Soup', price: 50, category: 'Starters', image: 's.jpg', ingredients: [] });
    await Order.create({
      _id: 'order_123',
      customerName: 'TestUser',
      totalPrice: 100,
      status: 'active',
      employee_id: 'E1',
      items: [{ menu_id: dish._id, quantity: 2 }]
    });

    const res = await request(app).get('/api/orders');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBe(1);
    expect(res.body[0].customerName).toBe('TestUser');
  });
});
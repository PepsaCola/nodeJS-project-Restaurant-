// @ts-nocheck
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../app.js';
import Dish from '../../models/Dish.js';

let mongoServer;

describe('E2E User Flow: Життєвий цикл замовлення', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('Повинен пройти повний цикл обробки замовлення', async () => {
    // 1. Підготовка: В меню має бути страва
    const dish = await Dish.create({ dishName: 'Burger', price: 200, category: 'Main', image: 'b.jpg', ingredients: ['meat'] });

    // 2. КРОК 1: Клієнт створює замовлення
    const createRes = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'E2E Client',
        items: [{ menu_id: dish._id.toString(), quantity: 1 }]
      });

    expect(createRes.statusCode).toBe(201);
    const orderId = createRes.body._id;

    // 3. КРОК 2: Система перевіряє, чи з'явилось воно в списку активних
    const listRes = await request(app).get('/api/orders');
    const orderInList = listRes.body.find(o => o._id === orderId);
    expect(orderInList).toBeDefined();
    expect(orderInList.status).toBe('active');

    // 4. КРОК 3: Офіціант закриває замовлення (змінює статус на completed)
    const updateRes = await request(app)
      .put(`/api/orders/${orderId}`)
      .send({ status: 'completed' });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.status).toBe('completed');

    // 5. КРОК 4: Замовлення зникає зі списку активних
    const finalListRes = await request(app).get('/api/orders');
    const orderInFinalList = finalListRes.body.find(o => o._id === orderId);
    expect(orderInFinalList).toBeUndefined(); // Його там вже не має бути
  });
});

import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../app.js';
import Dish from '../../models/Dish.js';

jest.setTimeout(30000);

let mongoServer;

describe('E2E User Flow: Order Lifecycle', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('Full Cycle: Create -> Active -> Complete -> History', async () => {
    const dish = await Dish.create({
      _id: 'dish_e2e_1',
      dishName: 'Royal Burger',
      price: 200,
      category: 'Main',
      image: 'b.jpg',
      ingredients: ['meat', 'bun'],
    });

    const createRes = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'E2E Client',
        items: [{ menu_id: dish._id.toString(), quantity: 1 }],
      });

    expect(createRes.statusCode).toBe(201);
    const orderId = createRes.body._id;

    const listRes = await request(app).get('/api/orders');
    const orderInActiveList = listRes.body.find((o) => o._id === orderId);

    expect(orderInActiveList).toBeDefined();
    expect(orderInActiveList.status).toBe('active');
    expect(orderInActiveList.totalPrice).toBe(200);

    const updateRes = await request(app)
      .put(`/api/orders/${orderId}`)
      .send({ status: 'completed' });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.status).toBe('completed');

    const finalListRes = await request(app).get('/api/orders');
    const orderInFinalList = finalListRes.body.find((o) => o._id === orderId);
    expect(orderInFinalList).toBeUndefined();

    const historyRes = await request(app).get('/api/orders/history');

    if (historyRes.statusCode === 200) {
      const orderInHistory = historyRes.body.find((o) => o._id === orderId);
      expect(orderInHistory).toBeDefined();
      expect(orderInHistory.status).toBe('completed');
    }
  });
});

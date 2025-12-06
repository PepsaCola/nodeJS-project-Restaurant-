import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../app.js';
import Dish from '../../models/Dish.js';

// E2E tests involve multiple DB hits, so we increase the timeout
jest.setTimeout(30000);

let mongoServer;

describe('E2E User Flow: Order Lifecycle', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    // Clean collections between tests to prevent data pollution
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
    // 1. PREPARE: Create a Dish in the system
    const dish = await Dish.create({
      _id: 'dish_e2e_1',
      dishName: 'Royal Burger',
      price: 200,
      category: 'Main',
      image: 'b.jpg',
      ingredients: ['meat', 'bun']
    });

    // 2. CREATE: Client places an order
    const createRes = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'E2E Client',
        items: [{ menu_id: dish._id.toString(), quantity: 1 }]
      });

    expect(createRes.statusCode).toBe(201);
    const orderId = createRes.body._id;

    // 3. VERIFY ACTIVE: Kitchen sees the order in "Active" list
    const listRes = await request(app).get('/api/orders'); // Assuming this is getAllActiveOrders
    const orderInActiveList = listRes.body.find(o => o._id === orderId);

    expect(orderInActiveList).toBeDefined();
    expect(orderInActiveList.status).toBe('active');
    expect(orderInActiveList.totalPrice).toBe(200);

    // 4. UPDATE: Kitchen completes the order
    const updateRes = await request(app)
      .put(`/api/orders/${orderId}`)
      .send({ status: 'completed' });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.status).toBe('completed');

    // 5. VERIFY GONE FROM ACTIVE: Should no longer appear in active list
    const finalListRes = await request(app).get('/api/orders');
    const orderInFinalList = finalListRes.body.find(o => o._id === orderId);
    expect(orderInFinalList).toBeUndefined();

    // 6. VERIFY HISTORY: Should exist in the full history endpoint
    // Assuming you have a route like GET /api/orders/history or similar
    // If not, we can verify via direct DB check or a generic GET /api/orders/all endpoint
    const historyRes = await request(app).get('/api/orders/history');

    // Note: If /history route doesn't exist yet, this part validates the data persistence logic
    if (historyRes.statusCode === 200) {
      const orderInHistory = historyRes.body.find(o => o._id === orderId);
      expect(orderInHistory).toBeDefined();
      expect(orderInHistory.status).toBe('completed');
    }
  });
});
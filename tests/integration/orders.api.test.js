import { jest, describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../app.js'; // Ensure this path is correct relative to your test file
import Dish from '../../models/Dish.js';
import Order from '../../models/Order.js';

// Increase timeout for MongoMemoryServer startup
jest.setTimeout(60000);

let mongoServer;

describe('Order API & Service Integration Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterEach(async () => {
    // Clean up data between tests
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  const createDish = async (id, name, price) => {
    return Dish.create({
      _id: id,
      dishName: name,
      price: price,
      category: 'Main',
      image: 'img.jpg',
      ingredients: ['ingredient1']
    });
  };

  describe('POST /api/orders (Create)', () => {
    it('should create an order successfully and calculate total price', async () => {
      const dish = await createDish('dish_001', 'Pizza', 150);

      const newOrderData = {
        customerName: 'Integration Tester',
        items: [{ menu_id: dish._id.toString(), quantity: 2 }]
      };

      const res = await request(app)
        .post('/api/orders')
        .send(newOrderData);

      expect(res.statusCode).toBe(201);
      expect(res.body.customerName).toBe('Integration Tester');
      expect(res.body.totalPrice).toBe(300);
      expect(res.body.status).toBe('active');
      expect(res.body.items).toHaveLength(1);
    });

    it('should return 404 if ordering a non-existent dish', async () => {
      const badOrder = {
        customerName: 'Fail Tester',
        items: [{ menu_id: 'non_existent_id', quantity: 1 }]
      };

      const res = await request(app).post('/api/orders').send(badOrder);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/orders (Active Orders)', () => {
    it('should return only active orders', async () => {
      const dish = await createDish('dish_002', 'Soup', 50);

      await Order.create({
        _id: 'order_active',
        customerName: 'Active User',
        totalPrice: 100,
        status: 'active',
        employee_id: 'E1',
        items: [{ menu_id: dish._id, quantity: 2 }]
      });

      // Create one COMPLETED order
      await Order.create({
        _id: 'order_completed',
        customerName: 'Completed User',
        totalPrice: 50,
        status: 'completed',
        employee_id: 'E1',
        items: [{ menu_id: dish._id, quantity: 1 }]
      });

      const res = await request(app).get('/api/orders');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].customerName).toBe('Active User');
    });
  });

  describe('Statistics & History', () => {
    it('should correctly calculate popular dishes based on quantity', async () => {

      await createDish('d_pizza', 'Pizza', 100);
      await createDish('d_burger', 'Burger', 80);

      await Order.create({
        _id: 'o1', customerName: 'U1', totalPrice: 500, status: 'completed', employee_id: 'E1',
        items: [{ menu_id: 'd_pizza', quantity: 5 }]
      });

      await Order.create({
        _id: 'o2', customerName: 'U2', totalPrice: 1000, status: 'completed', employee_id: 'E1',
        items: [
          { menu_id: 'd_pizza', quantity: 2 },
          { menu_id: 'd_burger', quantity: 10 }
        ]
      });

      const res = await request(app).get('/api/history/popular-dishes');

      expect(res.statusCode).toBe(200);
      expect(res.body[0].dishName).toBe('Burger');
      expect(res.body[0].totalQuantity).toBe(10);
      expect(res.body[1].dishName).toBe('Pizza');
      expect(res.body[1].totalQuantity).toBe(7);
    });
  });

  describe('DELETE /api/orders/:id', () => {
    it('should NOT delete an active order (Business Logic)', async () => {
      await Order.create({
        _id: 'ord_delete_active',
        customerName: 'Cant Delete Me',
        totalPrice: 10,
        status: 'active',
        employee_id: 'E1',
        items: []
      });

      const res = await request(app).delete('/api/orders/ord_delete_active');

      expect(res.statusCode).toBe(404);
    });

    it('should delete a completed order', async () => {
      await Order.create({
        _id: 'ord_delete_done',
        customerName: 'Delete Me',
        totalPrice: 10,
        status: 'completed',
        employee_id: 'E1',
        items: []
      });

      const res = await request(app).delete('/api/orders/ord_delete_done');
      expect(res.statusCode).toBe(204);

      const checkDb = await Order.findById('ord_delete_done');
      expect(checkDb).toBeNull();
    });
  });
});
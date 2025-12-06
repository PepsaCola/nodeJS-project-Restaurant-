// @ts-nocheck
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import OrderService from '../../services/order.js';
import Order from '../../models/Order.js';
import Dish from '../../models/Dish.js';

describe('Order Service Unit Tests', () => {

  // Очищаємо моки після кожного тесту, щоб spies не накладалися
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllHistory', () => {
    it('повинен повернути історію замовлень', async () => {
      const mockOrders = [{ _id: '1', status: 'completed' }];

      // Налаштовуємо spy для Order.find
      const mockSort = jest.fn().mockResolvedValue(mockOrders);
      const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });

      // Використовуємо spyOn замість mock
      jest.spyOn(Order, 'find').mockReturnValue({ populate: mockPopulate });

      const result = await OrderService.getAllHistory();

      expect(Order.find).toHaveBeenCalled();
      expect(mockPopulate).toHaveBeenCalledWith('items.menu_id', 'dishName price');
      expect(result).toEqual(mockOrders);
    });

    it('повинен викинути помилку, якщо БД впала', async () => {
      jest.spyOn(Order, 'find').mockImplementation(() => { throw new Error('DB Error'); });

      await expect(OrderService.getAllHistory())
        .rejects
        .toThrow('Не вдалося отримати історію замовлень');
    });
  });

  describe('createOrder', () => {
    it('повинен успішно створити замовлення і порахувати total price', async () => {
      const orderData = {
        customerName: 'Ivan',
        items: [
          { menu_id: 'dish1', quantity: 2 },
          { menu_id: 'dish2', quantity: 1 }
        ]
      };

      const mockDishes = [
        { _id: 'dish1', price: 100 },
        { _id: 'dish2', price: 50 }
      ];

      // Spy на Dish.find та Order.create
      jest.spyOn(Dish, 'find').mockResolvedValue(mockDishes);

      const createdOrder = { ...orderData, totalPrice: 250, _id: 'order123' };
      jest.spyOn(Order, 'create').mockResolvedValue(createdOrder);

      const result = await OrderService.createOrder(orderData);

      expect(Dish.find).toHaveBeenCalledWith({ _id: { $in: ['dish1', 'dish2'] } });

      expect(Order.create).toHaveBeenCalledWith(expect.objectContaining({
        customerName: 'Ivan',
        totalPrice: 250,
        status: 'active'
      }));

      expect(result).toEqual(createdOrder);
    });

    it('повинен викинути помилку 400, якщо немає імені або страв', async () => {
      await expect(OrderService.createOrder({ customerName: '' }))
        .rejects
        .toThrow('Потрібні ім’я клієнта та позиції замовлення.');
    });

    it('повинен викинути помилку 404, якщо страва не знайдена', async () => {
      const orderData = {
        customerName: 'Ivan',
        items: [{ menu_id: 'unknown_dish', quantity: 1 }]
      };

      jest.spyOn(Dish, 'find').mockResolvedValue([]);

      await expect(OrderService.createOrder(orderData))
        .rejects
        .toThrow('Страва з ID unknown_dish не знайдена.');
    });
  });

  describe('updateOrderStatus', () => {
    it('повинен оновити статус замовлення', async () => {
      const orderId = 'order1';
      const newStatus = 'completed';
      const mockUpdatedOrder = { _id: orderId, status: newStatus };

      jest.spyOn(Order, 'findByIdAndUpdate').mockResolvedValue(mockUpdatedOrder);

      const result = await OrderService.updateOrderStatus(orderId, newStatus);

      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        orderId,
        { status: newStatus },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('повинен викинути помилку 400 для неправильного статусу', async () => {
      await expect(OrderService.updateOrderStatus('id', 'cancelled'))
        .rejects
        .toThrow('Недійсний статус. Можливі: "active", "completed".');
    });

    it('повинен викинути помилку 404, якщо замовлення не знайдено', async () => {
      jest.spyOn(Order, 'findByIdAndUpdate').mockResolvedValue(null);

      await expect(OrderService.updateOrderStatus('id', 'completed'))
        .rejects
        .toThrow('Активне замовлення не знайдено.');
    });
  });

  describe('deleteOrder', () => {
    it('повинен видалити замовлення зі статусом completed', async () => {
      jest.spyOn(Order, 'findOneAndDelete').mockResolvedValue({ _id: 'order1' });

      await OrderService.deleteOrder('order1');

      expect(Order.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'order1',
        status: 'completed',
      });
    });

    it('повинен викинути 404, якщо замовлення активне або не існує', async () => {
      jest.spyOn(Order, 'findOneAndDelete').mockResolvedValue(null);

      await expect(OrderService.deleteOrder('order1'))
        .rejects
        .toThrow('Замовлення не знайдено або не має статусу "completed".');
    });
  });

  describe('getAllActiveOrders', () => {
    it('повинен повернути тільки активні замовлення', async () => {
      const mockOrders = [{ _id: '1', status: 'active' }];

      const mockSort = jest.fn().mockResolvedValue(mockOrders);
      const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
      jest.spyOn(Order, 'find').mockReturnValue({ populate: mockPopulate });

      const result = await OrderService.getAllActiveOrders();

      expect(Order.find).toHaveBeenCalledWith({ status: 'active' });
      expect(result).toEqual(mockOrders);
    });
  });
});
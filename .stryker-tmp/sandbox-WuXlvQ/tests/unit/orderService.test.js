// @ts-nocheck
import OrderService from '../../services/order.js';
import Order from '../../models/Order.js';
import Dish from '../../models/Dish.js';

// 1. Мокаємо (імітуємо) моделі Mongoose, щоб не лізти в реальну БД
jest.mock('../../models/Order.js');
jest.mock('../../models/Dish.js');

describe('Order Service Unit Tests', () => {

  // Очищаємо моки перед кожним тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllHistory', () => {
    it('повинен повернути історію замовлень', async () => {
      const mockOrders = [{ _id: '1', status: 'completed' }];

      // Налаштовуємо ланцюжок викликів Mongoose: find -> populate -> sort
      const mockSort = jest.fn().mockResolvedValue(mockOrders);
      const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
      Order.find.mockReturnValue({ populate: mockPopulate });

      const result = await OrderService.getAllHistory();

      expect(Order.find).toHaveBeenCalled();
      expect(mockPopulate).toHaveBeenCalledWith('items.menu_id', 'dishName price');
      expect(result).toEqual(mockOrders);
    });

    it('повинен викинути помилку, якщо БД впала', async () => {
      Order.find.mockImplementation(() => { throw new Error('DB Error'); });

      await expect(OrderService.getAllHistory())
        .rejects
        .toThrow('Не вдалося отримати історію замовлень');
    });
  });

  describe('createOrder', () => {
    it('повинен успішно створити замовлення і порахувати total price', async () => {
      // Вхідні дані
      const orderData = {
        customerName: 'Ivan',
        items: [
          { menu_id: 'dish1', quantity: 2 },
          { menu_id: 'dish2', quantity: 1 }
        ]
      };

      // Мокаємо страви (ціна 100 і 50)
      const mockDishes = [
        { _id: 'dish1', price: 100 },
        { _id: 'dish2', price: 50 }
      ];
      Dish.find.mockResolvedValue(mockDishes);

      // Мокаємо створення замовлення
      const createdOrder = { ...orderData, totalPrice: 250, _id: 'order123' };
      Order.create.mockResolvedValue(createdOrder);

      const result = await OrderService.createOrder(orderData);

      // Перевірка: Dish.find викликався з правильними ID
      expect(Dish.find).toHaveBeenCalledWith({ _id: { $in: ['dish1', 'dish2'] } });

      // Перевірка: Order.create викликався з правильною сумою (100*2 + 50*1 = 250)
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

      // Повертаємо пустий масив страв
      Dish.find.mockResolvedValue([]);

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

      Order.findByIdAndUpdate.mockResolvedValue(mockUpdatedOrder);

      const result = await OrderService.updateOrderStatus(orderId, newStatus);

      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        orderId,
        { status: newStatus },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('повинен викинути помилку 400 для неправильного статусу', async () => {
      await expect(OrderService.updateOrderStatus('id', 'cancelled')) // 'cancelled' немає в дозволеному списку у сервісі
        .rejects
        .toThrow('Недійсний статус. Можливі: "active", "completed".');
    });

    it('повинен викинути помилку 404, якщо замовлення не знайдено', async () => {
      Order.findByIdAndUpdate.mockResolvedValue(null);

      await expect(OrderService.updateOrderStatus('id', 'completed'))
        .rejects
        .toThrow('Активне замовлення не знайдено.');
    });
  });

  describe('deleteOrder', () => {
    it('повинен видалити замовлення зі статусом completed', async () => {
      Order.findOneAndDelete.mockResolvedValue({ _id: 'order1' });

      await OrderService.deleteOrder('order1');

      expect(Order.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'order1',
        status: 'completed',
      });
    });

    it('повинен викинути 404, якщо замовлення активне або не існує', async () => {
      Order.findOneAndDelete.mockResolvedValue(null);

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
      Order.find.mockReturnValue({ populate: mockPopulate });

      const result = await OrderService.getAllActiveOrders();

      expect(Order.find).toHaveBeenCalledWith({ status: 'active' });
      expect(result).toEqual(mockOrders);
    });
  });
});
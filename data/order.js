export let orderCounter = 2;
export const orders = [
  {
    _id: '1',
    customerName: 'Олена Коваль',
    totalPrice: 305.5,
    status: 'active',
    employee_id: 'E101',
    items: [
      { menu_id: 'M001', quantity: 1 },
      { menu_id: 'M002', quantity: 1 },
    ],
  },
];

module.exports = {
  orders,
  orderCounter,
};

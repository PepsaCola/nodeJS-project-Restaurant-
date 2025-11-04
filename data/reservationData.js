// Завантажуємо дані та ініціалізуємо лічильник
export let reservationCounter = 1;
export const reservations = [];
export const max_tables = 10;

module.exports = {
  reservations,
  reservationCounter,
  max_tables,
};

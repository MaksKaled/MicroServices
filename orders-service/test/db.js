
// Список заказов
let orders = [];

// Функция для создания нового заказа
const createOrder = async (userId, productId, quantity) => {
  const newOrder = { userId, productId, quantity };
  orders.push(newOrder);
  return newOrder;
};

// Функция для получения всех заказов
const getAllOrders = async () => {
  return orders;
};

// Очистка списка заказов
const clearOrders = async () => {
  orders = [];
};

const checkProductAvailability = async (productId) => {
  // Предположим, что продукт всегда доступен
  return true;
};


module.exports = {
  createOrder,
  getAllOrders,
  clearOrders,
  checkProductAvailability
};


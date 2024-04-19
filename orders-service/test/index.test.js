
const { createOrder, getAllOrders, clearOrders,checkProductAvailability } = require('./db');
const fetch = require('node-fetch')
jest.mock('node-fetch');

describe('Order Service', () => {
  beforeEach(async () => {
    await clearOrders(); // Очищаем список заказов перед каждым тестом
  });

  it('should create a new order', async () => {
    const userId = 1;
    const productId = 1;
    const quantity = 3;

    const newOrder = await createOrder(userId, productId, quantity);

    expect(newOrder.userId).toBe(userId);
    expect(newOrder.productId).toBe(productId);
    expect(newOrder.quantity).toBe(quantity);
  });

  it('should get all orders', async () => {
    const orders = await getAllOrders();
    expect(orders).toHaveLength(0);
  });

  it('should check product availability', async () => {
    // Предполагаемый ответ от catalog-service, когда продукт доступен
    const mockResponse = {
      ok: true,
      status: 200,
    };

    // Устанавливаем, что функция fetch возвращает предполагаемый ответ,
    // только для запроса к сервису каталога по конкретному productId
    fetch.mockResolvedValueOnce(mockResponse);

    // Теперь мы можем вызвать функцию checkProductAvailability и проверить, что она возвращает ожидаемый результат
    const productId = 1;
    const productAvailable = await checkProductAvailability(productId);
    expect(productAvailable).toBe(true);
  });
});



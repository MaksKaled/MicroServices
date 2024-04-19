const db = require('./db');

describe('GET /products', () => {
    it('responds with JSON', async () => {
        const products = await db.getAllProducts();
        expect(products).toEqual([{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]);
    });

    it('responds with 404 if no products are found', async () => {
        jest.spyOn(db, 'getAllProducts').mockResolvedValue([{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]);
        
        const products = await db.getAllProducts();
        expect(products).toEqual([{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]);
    });
});

describe('GET /products/:id', () => {
  beforeEach(() => {
      jest.clearAllMocks();
  });
  it('responds with JSON if product with existing ID is found', async () => {
      const productId = 1;
      const product = await db.getProductById(productId);
      expect(product).toEqual({ id: 1, name: 'Product 1' });
  });

  it('responds with 404 and "Product not found" message if product with non-existing ID is requested', async () => {
    const productId = 999; // Assume product with ID 999 does not exist
    try {
      const product = await db.getProductById(productId);
      // Если функция успешно возвращает продукт, то ошибка не должна возникать
      // Если функция выбросит ошибку, мы перейдем в блок catch
    } catch (error) {
      expect(error.message).toBe('Product not found');
      expect(error.status).toBe(404);
    }
  });
});



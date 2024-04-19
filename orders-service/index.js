const express = require('express');
const { Pool } = require('pg');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware для парсинга JSON
app.use(express.json());

// Подключение к базе данных PostgreSQL для заказов
const pool = new Pool({
  user: 'postgres',
  host: 'pr6-orders-database-1',
  database: 'orders_db',
  password: '12345',
  port: 5432,
});

// Функция для проверки наличия товара в сервисе каталога
async function checkProductAvailability(productId) {
    const response = await fetch(`http://catalog-service:3000/products/${productId}`);
    return response.ok;
  }
  

// Маршрут для создания нового заказа
app.post('/orders/create', async (req, res) => {
    const { userId, productId, quantity } = req.body || {};

    // Проверяем наличие обязательных свойств userId, productId и quantity
    if (!userId || !productId || !quantity) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Проверяем наличие товара в сервисе каталога
      const productAvailable = await checkProductAvailability(productId);
      if (!productAvailable) {
        return res.status(404).json({ error: 'Product not available' });
      }

      // Вставляем новый заказ в базу данных
      const client = await pool.connect();
      const result = await client.query('INSERT INTO orders (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [userId, productId, quantity]);
      const newOrder = result.rows[0];
      client.release();
  
      res.status(201).json(newOrder); // Возвращаем созданный заказ в качестве ответа
    } catch (err) {
      console.error('Error creating order', err);
      res.status(500).send('Internal Server Error');
    }
});

// Маршрут для получения всех заказов
app.get('/orders', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM orders');
  
      if (result.rows.length === 0) {
        res.status(404).send('No orders found');
      } else {
        const orders = result.rows;
        client.release();
        res.json(orders);
      }
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).send('Internal Server Error');
    }
});

// Запуск сервера
app.listen(PORT, () => {
  if (!process.env.TEST_MODE) {
    console.log(`Orders service is running on port ${PORT}`);
  }
});



// Экспорт функции checkProductAvailability
module.exports = {
  checkProductAvailability
};
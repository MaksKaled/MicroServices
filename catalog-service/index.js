
const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;
let pool;



 
  pool = new Pool({
    user: 'postgres',
    host: 'pr6-catalog-database-1',
    database: 'catalog_db',
    password: '12345',
    port: 5432,
  });




// Маршрут для получения списка товаров
app.get('/products', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM products');

    if (result.rows.length === 0) {
      res.status(404).send('No products found');
    } else {
      const products = result.rows;
      client.release();
      res.json(products);
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error: ' + err.message);
  }
});

// Маршрут для получения информации о конкретном товаре
app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM products WHERE id = $1', [productId]);

    if (result.rows.length === 0) {
      res.status(404).send('Product not found');
    } else {
      const product = result.rows[0];
      client.release();
      res.json(product);
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});



// Создание сервера и прослушивание порта
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Экспортируем приложение
module.exports = app;


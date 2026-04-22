require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pizza Delivery API',
      version: '1.0.0',
      description: 'API for pizza delivery service',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}`,
      },
    ],
  },
  apis: ['./app/routes/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Раздача статических файлов (фронтенд) - ДОЛЖНА БЫТЬ ДО ДРУГИХ МАРШРУТОВ
app.use(express.static(path.join(__dirname, '../public')));

// Database sync
const db = require("./models");
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced successfully.");
  })
  .catch(err => {
    console.log("❌ Failed to sync db: " + err.message);
  });

// Routes
require("./routes/pizza.routes")(app);
require("./routes/ingredient.routes")(app);
require("./routes/client.routes")(app);
require("./routes/address.routes")(app);
require("./routes/courier.routes")(app);
require("./routes/order.routes")(app);
require("./routes/auth.routes")(app);

// Fallback для SPA (если маршрут не найден, отдаём index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
  console.log(`🍕 Frontend: http://localhost:${PORT}`);
});
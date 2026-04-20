const db = require("../models");
const Order = db.Order;
const OrderItem = db.OrderItem;
const { QueryTypes } = db.Sequelize;

exports.create = async (req, res) => {
  const { orderNumber, clientId, addressId, items, comment, paymentMethod } = req.body;
  
  if (!orderNumber || !clientId || !addressId || !items || items.length === 0) {
    res.status(400).send({ message: "Missing required fields" });
    return;
  }

  // Вычисляем общую сумму
  let totalAmount = 0;
  for (const item of items) {
    totalAmount += item.priceAtOrder * item.quantity;
  }

  try {
    const order = await Order.create({
      orderNumber,
      clientId,
      addressId,
      totalAmount,
      comment,
      paymentMethod: paymentMethod || 'cash',
      status: 'new'
    });

    for (const item of items) {
      await OrderItem.create({
        orderId: order.id,
        pizzaId: item.pizzaId,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder
      });
    }

    res.send({ message: "Order created successfully", order });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findAll = (req, res) => {
  Order.findAll({
    order: [['orderDate', 'DESC']]
  })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findOne = (req, res) => {
  Order.findByPk(req.params.id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  Order.update(req.body, { where: { id: req.params.id } })
    .then(num => num == 1 ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = (req, res) => {
  Order.destroy({ where: { id: req.params.id } })
    .then(num => num == 1 ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

// Получить заказ с деталями (товары, клиент, адрес, курьер)
exports.getOrderDetails = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.sequelize.query(
      `SELECT 
        o.*,
        c.first_name as client_first_name,
        c.last_name as client_last_name,
        c.phone as client_phone,
        a.street, a.house, a.apartment, a.entrance, a.floor,
        cr.first_name as courier_first_name,
        cr.last_name as courier_last_name,
        cr.phone as courier_phone
       FROM orders o
       LEFT JOIN clients c ON o.client_id = c.id
       LEFT JOIN addresses a ON o.address_id = a.id
       LEFT JOIN couriers cr ON o.courier_id = cr.id
       WHERE o.id = ?`,
      {
        replacements: [id],
        type: QueryTypes.SELECT
      }
    );
    
    const items = await db.sequelize.query(
      `SELECT oi.*, p.name as pizza_name, p.price
       FROM order_items oi
       JOIN pizzas p ON oi.pizza_id = p.id
       WHERE oi.order_id = ?`,
      {
        replacements: [id],
        type: QueryTypes.SELECT
      }
    );
    
    res.send({ order: result[0], items });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Обновить статус заказа
exports.updateStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  
  try {
    await Order.update({ status }, { where: { id } });
    
    if (status === 'delivered') {
      await Order.update({ deliveryTime: new Date() }, { where: { id } });
      
      // Освободить курьера
      const order = await Order.findByPk(id);
      if (order.courierId) {
        await db.Courier.update({ status: 'free' }, { where: { id: order.courierId } });
      }
    }
    
    res.send({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
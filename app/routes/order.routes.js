/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - orderNumber
 *         - clientId
 *         - addressId
 *         - items
 *       properties:
 *         id:
 *           type: integer
 *         orderNumber:
 *           type: string
 *         clientId:
 *           type: integer
 *         addressId:
 *           type: integer
 *         courierId:
 *           type: integer
 *         totalAmount:
 *           type: number
 *           format: decimal
 *         status:
 *           type: string
 *           enum: [new, cooking, delivering, delivered, cancelled]
 *         orderDate:
 *           type: string
 *           format: date-time
 *         deliveryTime:
 *           type: string
 *           format: date-time
 *         comment:
 *           type: string
 *         paymentMethod:
 *           type: string
 *     
 *     OrderItem:
 *       type: object
 *       required:
 *         - pizzaId
 *         - quantity
 *         - priceAtOrder
 *       properties:
 *         pizzaId:
 *           type: integer
 *         quantity:
 *           type: integer
 *         priceAtOrder:
 *           type: number
 *           format: decimal
 *     
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - orderNumber
 *         - clientId
 *         - addressId
 *         - items
 *       properties:
 *         orderNumber:
 *           type: string
 *         clientId:
 *           type: integer
 *         addressId:
 *           type: integer
 *         paymentMethod:
 *           type: string
 *         comment:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 */

module.exports = app => {
  const controller = require("../controllers/order.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/orders:
   *   post:
   *     summary: Create a new order
   *     tags: [Orders]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateOrderRequest'
   *     responses:
   *       200:
   *         description: Order created successfully
   *       400:
   *         description: Missing required fields
   *       500:
   *         description: Server error
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /api/orders:
   *   get:
   *     summary: Get all orders
   *     tags: [Orders]
   *     responses:
   *       200:
   *         description: List of orders
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Order'
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /api/orders/{id}:
   *   get:
   *     summary: Get order by ID
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Order object
   *       404:
   *         description: Order not found
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /api/orders/{id}/details:
   *   get:
   *     summary: Get full order details (with client, address, courier, items)
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Full order details
   */
  router.get("/:id/details", controller.getOrderDetails);

  /**
   * @swagger
   * /api/orders/{id}:
   *   put:
   *     summary: Update order by ID
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Order'
   *     responses:
   *       200:
   *         description: Order updated
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /api/orders/{id}/status:
   *   put:
   *     summary: Update order status
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - status
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [new, cooking, delivering, delivered, cancelled]
   *     responses:
   *       200:
   *         description: Status updated successfully
   */
  router.put("/:id/status", controller.updateStatus);

  /**
   * @swagger
   * /api/orders/{id}:
   *   delete:
   *     summary: Delete order by ID
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Order deleted
   */
  router.delete("/:id", controller.delete);

  app.use('/api/orders', router);
};
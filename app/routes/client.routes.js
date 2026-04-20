/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - phone
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         loyaltyPoints:
 *           type: integer
 *         registrationDate:
 *           type: string
 *           format: date
 */

module.exports = app => {
  const controller = require("../controllers/client.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/clients:
   *   post:
   *     summary: Create a new client
   *     tags: [Clients]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Client'
   *     responses:
   *       200:
   *         description: Client created
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /api/clients:
   *   get:
   *     summary: Get all clients
   *     tags: [Clients]
   *     responses:
   *       200:
   *         description: List of clients
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /api/clients/{id}:
   *   get:
   *     summary: Get client by ID
   *     tags: [Clients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Client object
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /api/clients/{id}/orders:
   *   get:
   *     summary: Get all orders for a client
   *     tags: [Clients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: List of orders
   */
  router.get("/:id/orders", controller.getClientOrders);

  /**
   * @swagger
   * /api/clients/{id}:
   *   put:
   *     summary: Update client by ID
   *     tags: [Clients]
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
   *             $ref: '#/components/schemas/Client'
   *     responses:
   *       200:
   *         description: Client updated
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /api/clients/{id}:
   *   delete:
   *     summary: Delete client by ID
   *     tags: [Clients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Client deleted
   */
  router.delete("/:id", controller.delete);

  app.use('/api/clients', router);
};
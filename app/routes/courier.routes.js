/**
 * @swagger
 * components:
 *   schemas:
 *     Courier:
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
 *         status:
 *           type: string
 *           enum: [free, busy, offline]
 *         rating:
 *           type: number
 *           format: decimal
 *         vehicle:
 *           type: string
 *         hireDate:
 *           type: string
 *           format: date
 */

module.exports = app => {
  const controller = require("../controllers/courier.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/couriers:
   *   post:
   *     summary: Create a new courier
   *     tags: [Couriers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Courier'
   *     responses:
   *       200:
   *         description: Courier created
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /api/couriers:
   *   get:
   *     summary: Get all couriers
   *     tags: [Couriers]
   *     responses:
   *       200:
   *         description: List of couriers
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /api/couriers/free:
   *   get:
   *     summary: Get all free couriers
   *     tags: [Couriers]
   *     responses:
   *       200:
   *         description: List of free couriers
   */
  router.get("/free", controller.getFreeCouriers);

  /**
   * @swagger
   * /api/couriers/{id}:
   *   get:
   *     summary: Get courier by ID
   *     tags: [Couriers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Courier object
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /api/couriers/{id}:
   *   put:
   *     summary: Update courier by ID
   *     tags: [Couriers]
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
   *             $ref: '#/components/schemas/Courier'
   *     responses:
   *       200:
   *         description: Courier updated
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /api/couriers/{id}:
   *   delete:
   *     summary: Delete courier by ID
   *     tags: [Couriers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Courier deleted
   */
  router.delete("/:id", controller.delete);

  /**
   * @swagger
   * /api/couriers/assign:
   *   post:
   *     summary: Assign courier to order
   *     tags: [Couriers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - courierId
   *               - orderId
   *             properties:
   *               courierId:
   *                 type: integer
   *               orderId:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Courier assigned successfully
   */
  router.post("/assign", controller.assignToOrder);

  app.use('/api/couriers', router);
};
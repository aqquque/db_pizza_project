/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - clientId
 *         - street
 *         - house
 *       properties:
 *         id:
 *           type: integer
 *         clientId:
 *           type: integer
 *         street:
 *           type: string
 *         house:
 *           type: string
 *         apartment:
 *           type: string
 *         entrance:
 *           type: string
 *         floor:
 *           type: integer
 *         comment:
 *           type: string
 *         isMain:
 *           type: boolean
 */

module.exports = app => {
  const controller = require("../controllers/address.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/addresses:
   *   post:
   *     summary: Create a new address
   *     tags: [Addresses]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Address'
   *     responses:
   *       200:
   *         description: Address created
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /api/addresses:
   *   get:
   *     summary: Get all addresses
   *     tags: [Addresses]
   *     responses:
   *       200:
   *         description: List of addresses
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /api/addresses/client/{clientId}:
   *   get:
   *     summary: Get addresses by client ID
   *     tags: [Addresses]
   *     parameters:
   *       - in: path
   *         name: clientId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: List of addresses for client
   */
  router.get("/client/:clientId", controller.getByClient);

  /**
   * @swagger
   * /api/addresses/{id}:
   *   get:
   *     summary: Get address by ID
   *     tags: [Addresses]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Address object
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /api/addresses/{id}:
   *   put:
   *     summary: Update address by ID
   *     tags: [Addresses]
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
   *             $ref: '#/components/schemas/Address'
   *     responses:
   *       200:
   *         description: Address updated
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /api/addresses/{id}:
   *   delete:
   *     summary: Delete address by ID
   *     tags: [Addresses]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Address deleted
   */
  router.delete("/:id", controller.delete);

  app.use('/api/addresses', router);
};
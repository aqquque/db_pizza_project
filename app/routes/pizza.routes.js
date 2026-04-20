/**
 * @swagger
 * components:
 *   schemas:
 *     Pizza:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           description: Pizza name
 *         description:
 *           type: string
 *           description: Pizza description
 *         price:
 *           type: number
 *           format: decimal
 *           description: Base price
 *         isVegetarian:
 *           type: boolean
 *           description: Vegetarian flag
 *         imageUrl:
 *           type: string
 *           description: Image URL
 *       example:
 *         name: "Маргарита"
 *         description: "Томатный соус, моцарелла, базилик"
 *         price: 450
 *         isVegetarian: true
 * 
 *     Ingredient:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         extraPrice:
 *           type: number
 *           format: decimal
 *         inStock:
 *           type: boolean
 *         calories:
 *           type: integer
 */

module.exports = app => {
  const controller = require("../controllers/pizza.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/pizzas:
   *   post:
   *     summary: Create a new pizza
   *     tags: [Pizzas]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Pizza'
   *     responses:
   *       200:
   *         description: Pizza created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Pizza'
   *       500:
   *         description: Server error
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /api/pizzas:
   *   get:
   *     summary: Get all pizzas
   *     tags: [Pizzas]
   *     responses:
   *       200:
   *         description: List of pizzas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Pizza'
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /api/pizzas/paginated:
   *   get:
   *     summary: Get pizzas with pagination
   *     tags: [Pizzas]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *         description: Items per page
   *     responses:
   *       200:
   *         description: Paginated list of pizzas
   */
  router.get("/paginated", controller.findAllPaginated);

  /**
   * @swagger
   * /api/pizzas/{id}:
   *   get:
   *     summary: Get pizza by ID
   *     tags: [Pizzas]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Pizza object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Pizza'
   *       404:
   *         description: Pizza not found
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /api/pizzas/{id}/ingredients:
   *   get:
   *     summary: Get all ingredients for a pizza
   *     tags: [Pizzas]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: List of ingredients
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Ingredient'
   */
  router.get("/:id/ingredients", controller.getIngredients);

  /**
   * @swagger
   * /api/pizzas/{id}:
   *   put:
   *     summary: Update pizza by ID
   *     tags: [Pizzas]
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
   *             $ref: '#/components/schemas/Pizza'
   *     responses:
   *       200:
   *         description: Pizza updated successfully
   *       404:
   *         description: Pizza not found
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /api/pizzas/{id}:
   *   delete:
   *     summary: Delete pizza by ID
   *     tags: [Pizzas]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Pizza deleted successfully
   *       404:
   *         description: Pizza not found
   */
  router.delete("/:id", controller.delete);

  app.use('/api/pizzas', router);
};
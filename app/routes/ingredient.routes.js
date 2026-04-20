/**
 * @swagger
 * components:
 *   schemas:
 *     IngredientInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
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
  const controller = require("../controllers/ingredient.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/ingredients:
   *   post:
   *     summary: Create a new ingredient
   *     tags: [Ingredients]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/IngredientInput'
   *     responses:
   *       200:
   *         description: Ingredient created
   */
  router.post("/", controller.create);

  /**
   * @swagger
   * /api/ingredients:
   *   get:
   *     summary: Get all ingredients
   *     tags: [Ingredients]
   *     responses:
   *       200:
   *         description: List of ingredients
   */
  router.get("/", controller.findAll);

  /**
   * @swagger
   * /api/ingredients/{id}:
   *   get:
   *     summary: Get ingredient by ID
   *     tags: [Ingredients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Ingredient object
   */
  router.get("/:id", controller.findOne);

  /**
   * @swagger
   * /api/ingredients/{id}:
   *   put:
   *     summary: Update ingredient by ID
   *     tags: [Ingredients]
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
   *             $ref: '#/components/schemas/IngredientInput'
   *     responses:
   *       200:
   *         description: Ingredient updated
   */
  router.put("/:id", controller.update);

  /**
   * @swagger
   * /api/ingredients/{id}:
   *   delete:
   *     summary: Delete ingredient by ID
   *     tags: [Ingredients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Ingredient deleted
   */
  router.delete("/:id", controller.delete);

  app.use('/api/ingredients', router);
};
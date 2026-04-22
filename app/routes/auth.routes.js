/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Имя пользователя
 *           example: admin
 *         password:
 *           type: string
 *           description: Пароль
 *           example: admin123
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID пользователя
 *         username:
 *           type: string
 *           description: Имя пользователя
 *         role:
 *           type: string
 *           enum: [admin, courier]
 *           description: Роль пользователя
 *         courierId:
 *           type: integer
 *           description: ID курьера (только для роли courier)
 *         courier:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             phone:
 *               type: string
 *             status:
 *               type: string
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

module.exports = app => {
  const controller = require("../controllers/auth.controller.js");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Авторизация пользователя
   *     description: Вход в систему для администратора или курьера
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Успешная авторизация
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       401:
   *         description: Неверное имя пользователя или пароль
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Ошибка сервера
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post("/login", controller.login);
  
  app.use('/api/auth', router);
};
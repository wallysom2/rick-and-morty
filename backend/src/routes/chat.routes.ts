import { Router, type Router as RouterType } from 'express';
import { chatController } from '../controllers/chat.controller.js';

const router: RouterType = Router();

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Chat with Rick or Morty
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - character
 *             properties:
 *               message:
 *                 type: string
 *                 description: The user's message
 *                 maxLength: 1000
 *               character:
 *                 type: string
 *                 enum: [rick, morty]
 *                 description: Which character to chat with
 *               history:
 *                 type: array
 *                 description: Previous conversation messages (max 20)
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: Chat response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                 character:
 *                   type: string
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/', (req, res) => chatController.chat(req, res));

export default router;

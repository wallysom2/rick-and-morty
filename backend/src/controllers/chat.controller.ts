import type { Request, Response } from 'express';
import { z } from 'zod';
import { chatService, type ChatMessage, type ChatCharacter } from '../services/chat.service.js';
import { logger } from '../utils/logger.js';

const chatRequestSchema = z.object({
    message: z.string().min(1).max(1000),
    character: z.enum(['rick', 'morty']),
    history: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string()
    })).max(20).optional().default([])
});

export class ChatController {
    async chat(req: Request, res: Response): Promise<void> {
        try {
            const validation = chatRequestSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    error: 'Invalid request',
                    details: validation.error.flatten().fieldErrors
                });
                return;
            }

            const { message, character, history } = validation.data;

            logger.info(`Chat request: character=${character}, message="${message.substring(0, 50)}..."`);

            const response = await chatService.chat(
                message,
                character as ChatCharacter,
                history as ChatMessage[]
            );

            res.json({
                response,
                character
            });
        } catch (error) {
            logger.error('Chat controller error:', error);
            res.status(500).json({
                error: 'Failed to process chat message'
            });
        }
    }
}

export const chatController = new ChatController();

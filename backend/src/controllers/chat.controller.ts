import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { chatService, type ChatMessage, type ChatCharacter } from '../services/chat.service.js';

const chatRequestSchema = z.object({
    message: z.string().min(1).max(1000),
    character: z.enum(['rick', 'morty']),
    history: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string()
    })).max(20).optional().default([])
});

export class ChatController {
    async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validation = chatRequestSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    error: {
                        message: 'Invalid request',
                        status: 400,
                        errors: validation.error.flatten().fieldErrors
                    }
                });
                return;
            }

            const { message, character, history } = validation.data;

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
            next(error);
        }
    }
}

export const chatController = new ChatController();

import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

// Resolve path to docs - works in both dev (src/) and prod (dist/)
const docsPath = path.join(process.cwd(), 'src/docs/*.yaml');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rick and Morty Catalog API',
      version: '1.0.0',
      description: 'API for browsing Rick and Morty characters, episodes, locations, managing favorites, and chatting with AI-powered characters',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
    components: {
      schemas: {
        Character: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Rick Sanchez' },
            status: { type: 'string', enum: ['Alive', 'Dead', 'unknown'], example: 'Alive' },
            species: { type: 'string', example: 'Human' },
            type: { type: 'string', example: '' },
            gender: { type: 'string', example: 'Male' },
            origin: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                url: { type: 'string' },
              },
            },
            location: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                url: { type: 'string' },
              },
            },
            image: { type: 'string', example: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg' },
            episode: { type: 'array', items: { type: 'string' } },
            url: { type: 'string' },
            created: { type: 'string', format: 'date-time' },
          },
        },
        Episode: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Pilot' },
            air_date: { type: 'string', example: 'December 2, 2013' },
            episode: { type: 'string', example: 'S01E01' },
            characters: { type: 'array', items: { type: 'string' } },
            url: { type: 'string' },
            created: { type: 'string', format: 'date-time' },
          },
        },
        Location: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Earth (C-137)' },
            type: { type: 'string', example: 'Planet' },
            dimension: { type: 'string', example: 'Dimension C-137' },
            residents: { type: 'array', items: { type: 'string' } },
            url: { type: 'string' },
            created: { type: 'string', format: 'date-time' },
          },
        },
        Favorite: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            characterId: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Rick Sanchez' },
            image: { type: 'string', example: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg' },
            species: { type: 'string', example: 'Human' },
            status: { type: 'string', enum: ['Alive', 'Dead', 'unknown'], example: 'Alive' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        PaginationInfo: {
          type: 'object',
          properties: {
            count: { type: 'integer' },
            pages: { type: 'integer' },
            next: { type: 'string', nullable: true },
            prev: { type: 'string', nullable: true },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                status: { type: 'integer' },
              },
            },
          },
        },
      },
    },
  },
  apis: [docsPath],
};

export const swaggerSpec = swaggerJsdoc(options);

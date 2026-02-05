import OpenAI from 'openai';
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions';
import { rickAndMortyService } from './rickandmorty.service.js';
import { favoritesService } from './favorites.service.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

// Character personas em Português
const RICK_SYSTEM_PROMPT = `Você é Rick Sanchez de Rick and Morty. Cientista genial, cínico, bêbado. O mais inteligente do multiverso.

CONTEXTO: Você está em um site/app sobre Rick and Morty conversando com um FÃ da série, NÃO com o Morty.

REGRAS ABSOLUTAS:
- Responda SEMPRE em português brasileiro
- Respostas CURTAS: máximo 2-3 frases
- Arrote frequente: *burp*, *arroto*
- Seja grosseiro, sarcástico, impaciente
- Trate o usuário como um fã curioso (não como Morty!)
- Use apelidos como: "garoto", "cara", "gênio" (irônico), "amigo"
- Fale "Wubba lubba dub dub!" quando apropriado
- Mencione portal gun, dimensões, ciência maluca
- Use as tools para buscar dados da API quando perguntarem sobre personagens/episódios/locais
- Use as tools de favoritos quando perguntarem quem está favoritado ou sobre a lista de favoritos do usuário
- Se perguntarem algo fora de Rick and Morty, seja rude e mude de assunto

Exemplos de tom:
- "Escuta aqui, *burp* isso é óbvio demais pra eu explicar pra você."
- "Ah, quer saber sobre isso? Tá, whatever, vou te contar."
- "Cara, você não sabe isso? *arroto* Patético."`;

const MORTY_SYSTEM_PROMPT = `Você é Morty Smith de Rick and Morty. 14 anos, nervoso, inseguro, neto do Rick.

CONTEXTO: Você está em um site/app sobre Rick and Morty conversando com um FÃ da série, NÃO com o Rick ou sua família.

REGRAS ABSOLUTAS:
- Responda SEMPRE em português brasileiro
- Respostas CURTAS: máximo 2-3 frases
- Use expressões nervosas: "Ai caramba!", "Ah não!", "Nossa!", "É-é que..."
- Gagueje às vezes: "E-eu acho que...", "T-tá bom..."
- Seja medroso mas tente ajudar o usuário
- Mencione suas aventuras com o Rick
- Fique envergonhado se mencionarem Jessica
- Use as tools para buscar dados da API quando perguntarem sobre personagens/episódios/locais
- Use as tools de favoritos quando perguntarem quem está favoritado ou sobre a lista de favoritos do usuário
- Se perguntarem algo fora de Rick and Morty, diga nervosamente que não sabe

Exemplos de tom:
- "Ai caramba! E-eu posso te ajudar com isso..."
- "Nossa, o Rick me levou pra esse lugar uma vez, foi horrível!"
- "Ah não, n-não me pergunta sobre a Jessica!"`;


// Tool definitions para a Rick and Morty API (https://rickandmortyapi.com)
const TOOLS: ChatCompletionTool[] = [
    {
        type: 'function',
        function: {
            name: 'search_characters',
            description: 'Busca personagens no universo de Rick and Morty por nome, status (Alive/Dead/unknown), espécie ou gênero. Use esta ferramenta quando o usuário perguntar sobre personagens.',
            parameters: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'Nome do personagem para buscar (ex: Rick, Morty, Summer)' },
                    status: { type: 'string', enum: ['Alive', 'Dead', 'unknown'], description: 'Status do personagem (Alive=Vivo, Dead=Morto, unknown=Desconhecido)' },
                    species: { type: 'string', description: 'Espécie do personagem (ex: Human, Alien, Robot)' },
                    gender: { type: 'string', enum: ['male', 'female', 'genderless', 'unknown'], description: 'Gênero do personagem' }
                }
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_character_by_id',
            description: 'Obtém informações detalhadas sobre um personagem específico pelo ID',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'number', description: 'O ID do personagem' }
                },
                required: ['id']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'search_episodes',
            description: 'Busca episódios por nome ou código do episódio (ex: S01E01). Use quando o usuário perguntar sobre episódios da série.',
            parameters: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'Nome do episódio para buscar' },
                    episode: { type: 'string', description: 'Código do episódio como S01E01, S02E05, etc' }
                }
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_episode_by_id',
            description: 'Obtém informações detalhadas sobre um episódio específico pelo ID',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'number', description: 'O ID do episódio' }
                },
                required: ['id']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'search_locations',
            description: 'Busca localizações no universo de Rick and Morty por nome, tipo ou dimensão. Use quando o usuário perguntar sobre planetas, dimensões ou lugares.',
            parameters: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'Nome da localização para buscar' },
                    type: { type: 'string', description: 'Tipo de localização (ex: Planet, Space station, Dimension)' },
                    dimension: { type: 'string', description: 'Nome da dimensão (ex: Dimension C-137)' }
                }
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_location_by_id',
            description: 'Obtém informações detalhadas sobre uma localização específica pelo ID',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'number', description: 'O ID da localização' }
                },
                required: ['id']
            }
        }
    },
    // Tools para o sistema de favoritos do usuário
    {
        type: 'function',
        function: {
            name: 'get_favorites',
            description: 'Lista todos os personagens favoritados pelo usuário no sistema. Use quando perguntarem "quem está favoritado?", "meus favoritos", "quais personagens eu curti", etc.',
            parameters: {
                type: 'object',
                properties: {
                    page: { type: 'number', description: 'Número da página (opcional, padrão 1)' },
                    limit: { type: 'number', description: 'Quantidade por página (opcional, padrão 10, máximo 20)' }
                }
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_favorites_count',
            description: 'Retorna a quantidade total de personagens favoritados pelo usuário. Use quando perguntarem "quantos favoritos tenho?", "total de favoritos", etc.',
            parameters: {
                type: 'object',
                properties: {}
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'check_is_favorite',
            description: 'Verifica se um personagem específico está na lista de favoritos do usuário. Use quando perguntarem "o Rick está favoritado?", "favoritei o Morty?", etc.',
            parameters: {
                type: 'object',
                properties: {
                    characterId: { type: 'number', description: 'ID do personagem para verificar' }
                },
                required: ['characterId']
            }
        }
    }
];

export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

export type ChatCharacter = 'rick' | 'morty';

export class ChatService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY,
        });
    }

    private getSystemPrompt(character: ChatCharacter): string {
        return character === 'rick' ? RICK_SYSTEM_PROMPT : MORTY_SYSTEM_PROMPT;
    }

    private async executeTool(name: string, args: Record<string, unknown>): Promise<string> {
        logger.debug(`Executing tool: ${name}`, args);

        try {
            switch (name) {
                case 'search_characters': {
                    const result = await rickAndMortyService.getCharacters({
                        name: args.name as string | undefined,
                        status: args.status as 'Alive' | 'Dead' | 'unknown' | undefined,
                        species: args.species as string | undefined,
                        gender: args.gender as 'male' | 'female' | 'genderless' | 'unknown' | undefined,
                    });
                    const characters = result.results.slice(0, 5).map(c => ({
                        id: c.id,
                        name: c.name,
                        status: c.status,
                        species: c.species,
                        origin: c.origin.name,
                        location: c.location.name
                    }));
                    return JSON.stringify({ count: result.info.count, characters });
                }

                case 'get_character_by_id': {
                    const character = await rickAndMortyService.getCharacterById(args.id as number);
                    if (!character) return JSON.stringify({ error: 'Personagem não encontrado' });
                    return JSON.stringify({
                        name: character.name,
                        status: character.status,
                        species: character.species,
                        gender: character.gender,
                        origin: character.origin.name,
                        location: character.location.name,
                        episodeCount: character.episode.length
                    });
                }

                case 'search_episodes': {
                    const result = await rickAndMortyService.getEpisodes({
                        name: args.name as string | undefined,
                        episode: args.episode as string | undefined,
                    });
                    const episodes = result.results.slice(0, 5).map(e => ({
                        id: e.id,
                        name: e.name,
                        episode: e.episode,
                        air_date: e.air_date,
                        characterCount: e.characters.length
                    }));
                    return JSON.stringify({ count: result.info.count, episodes });
                }

                case 'get_episode_by_id': {
                    const episode = await rickAndMortyService.getEpisodeById(args.id as number);
                    if (!episode) return JSON.stringify({ error: 'Episódio não encontrado' });
                    return JSON.stringify({
                        name: episode.name,
                        episode: episode.episode,
                        air_date: episode.air_date,
                        characterCount: episode.characters.length
                    });
                }

                case 'search_locations': {
                    const result = await rickAndMortyService.getLocations({
                        name: args.name as string | undefined,
                        type: args.type as string | undefined,
                        dimension: args.dimension as string | undefined,
                    });
                    const locations = result.results.slice(0, 5).map(l => ({
                        id: l.id,
                        name: l.name,
                        type: l.type,
                        dimension: l.dimension,
                        residentCount: l.residents.length
                    }));
                    return JSON.stringify({ count: result.info.count, locations });
                }

                case 'get_location_by_id': {
                    const location = await rickAndMortyService.getLocationById(args.id as number);
                    if (!location) return JSON.stringify({ error: 'Localização não encontrada' });
                    return JSON.stringify({
                        name: location.name,
                        type: location.type,
                        dimension: location.dimension,
                        residentCount: location.residents.length
                    });
                }

                // Tools para favoritos do sistema
                case 'get_favorites': {
                    const page = (args.page as number) || 1;
                    const limit = Math.min((args.limit as number) || 10, 20);
                    const result = await favoritesService.getAllFavorites({ page, limit });
                    const favorites = result.data.map(f => ({
                        characterId: f.characterId,
                        name: f.name,
                        species: f.species,
                        status: f.status
                    }));
                    return JSON.stringify({ 
                        total: result.pagination.total,
                        page: result.pagination.page,
                        totalPages: result.pagination.pages,
                        favoritos: favorites 
                    });
                }

                case 'get_favorites_count': {
                    const count = await favoritesService.getFavoritesCount();
                    return JSON.stringify({ 
                        total: count,
                        mensagem: count === 0 
                            ? 'Nenhum personagem favoritado ainda' 
                            : `${count} personagem(ns) favoritado(s)`
                    });
                }

                case 'check_is_favorite': {
                    const characterId = args.characterId as number;
                    const isFavorite = await favoritesService.isFavorite(characterId);
                    // Buscar nome do personagem para resposta mais rica
                    let characterName = `ID ${characterId}`;
                    try {
                        const character = await rickAndMortyService.getCharacterById(characterId);
                        if (character) characterName = character.name;
                    } catch {
                        // ignora erro, usa ID
                    }
                    return JSON.stringify({ 
                        characterId,
                        name: characterName,
                        isFavorite,
                        mensagem: isFavorite 
                            ? `${characterName} está na lista de favoritos!` 
                            : `${characterName} não está favoritado.`
                    });
                }

                default:
                    return JSON.stringify({ error: 'Ferramenta desconhecida' });
            }
        } catch (error) {
            logger.error(`Tool execution error: ${name}`, error);
            return JSON.stringify({ error: 'Falha ao buscar dados da API' });
        }
    }

    async chat(
        message: string,
        character: ChatCharacter,
        history: ChatMessage[] = []
    ): Promise<string> {
        // Build messages array with system prompt and history
        const messages: ChatCompletionMessageParam[] = [
            { role: 'system', content: this.getSystemPrompt(character) },
            ...history.slice(-10).map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content
            })),
            { role: 'user', content: message }
        ];

        try {
            // First API call
            let response = await this.openai.chat.completions.create({
model: 'gpt-4o-mini',
                messages,
                tools: TOOLS,
                tool_choice: 'auto',
                temperature: 0.7,
                max_tokens: 150,
            });

            let assistantMessage = response.choices[0].message;

            // Handle tool calls (loop up to 3 times for chained tool calls)
            let toolCallCount = 0;
            while (assistantMessage.tool_calls && toolCallCount < 3) {
                toolCallCount++;
                logger.debug(`Processing ${assistantMessage.tool_calls.length} tool calls (iteration ${toolCallCount})`);

                // Add assistant's tool call message
                messages.push(assistantMessage);

                // Execute each tool call and add results
                for (const toolCall of assistantMessage.tool_calls) {
                    if (toolCall.type !== 'function') continue;
                    const args = JSON.parse(toolCall.function.arguments);
                    const result = await this.executeTool(toolCall.function.name, args);

                    messages.push({
                        role: 'tool',
                        tool_call_id: toolCall.id,
                        content: result,
                    });
                }

// Get next response (more tokens after tool calls for richer responses)
                response = await this.openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages,
                    tools: TOOLS,
                    tool_choice: 'auto',
                    temperature: 0.6,
                    max_tokens: 300,
                });

                assistantMessage = response.choices[0].message;
            }

            return assistantMessage.content || "Eu... eu não sei o que dizer, ai caramba.";
        } catch (error) {
            logger.error('Chat completion error:', error);
            throw new Error('Falha ao gerar resposta');
        }
    }
}

// Singleton instance
export const chatService = new ChatService();

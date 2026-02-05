import OpenAI from 'openai';
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions';
import { rickAndMortyService } from './rickandmorty.service.js';
import { favoritesService } from './favorites.service.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

// Character personas em Português
// Character personas em Português
const RICK_SYSTEM_PROMPT = `Você é Rick Sanchez de Rick and Morty. O cientista mais inteligente do multiverso infinito. Niilista, alcóolatra, genial e profundamente cínico.

CONTEXTO: Você está em um site/app sobre Rick and Morty conversando com um FÃ da série, NÃO com o Morty ou sua família.

PERSONALIDADE:
- Inteligência suprema com paciência zero
- Arrote sem cerimônia: *arroto*, *ARROTO*, *arrotão*
- Alterne entre indiferença total e explosões de genialidade
- Menospreze conceitos simples, mas se empolgue com ciência maluca
- Mencione casualmente viagens interdimensionais como quem fala do trânsito
- Faça referências a: portal gun, dimensão C-137, Conselho de Ricks, Morty's substituíveis
- Demonstre seu niilismo: "nada importa", "infinitos universos", "tudo é aleatório"

TOM E LINGUAGEM:
- Xingue com criatividade (sem palavrões pesados, mantenha PG-13)
- Use sarcasmo afiado e humor negro
- Interrompa suas próprias frases com arrotos estratégicos
- Seja condescendente mas tecnicamente preciso
- Responda SEMPRE em português brasileiro
- Máximo 2-4 frases (seja direto, você é ocupado demais)

COMPORTAMENTO COM TOOLS:
- Use tools da API quando perguntarem sobre personagens/episódios/locais
- Use tools de favoritos quando perguntarem sobre listas do usuário
- Reclame antes de usar as tools: "Ugh, sério? *arroto* Tá bom..."
- Após buscar dados, comente com desdém sobre a informação

TÓPICOS ESPECIAIS:
- Se mencionarem Morty: mostre afeto disfarçado de utilitarismo
- Se mencionarem Bird Person: breve melancolia, depois volte ao cinismo
- Se mencionarem Unity: mude de assunto rapidamente
- Se perguntarem algo fora de Rick and Morty: "Isso é tão irrelevante que dói, *arroto* vamos falar de ciência de verdade"

EXEMPLOS:
- "Olha, *arroto* você quer que eu explique física quântica pra você ou quer continuar fazendo perguntas idiotas?"
- "Cara, eu já estive em 47 dimensões hoje. Sua pergunta tá no final da fila, *ARROTO*, mas tá bom..."
- "Ah sim, esse episódio. *arroto* Bons tempos... se você ignora a parte onde quase destruí a realidade. Whatever."
- "Escuta aqui, se eu tivesse um portal por cada vez que alguém me pergunta isso... *arroto* ...bom, eu já tenho portais infinitos, então péssima analogia."`;

const MORTY_SYSTEM_PROMPT = `Você é Morty Smith de Rick and Morty. 14 anos, estudante, neto ansioso do Rick. Voz da razão moral (geralmente ignorada).

CONTEXTO: Você está em um site/app sobre Rick and Morty conversando com um FÃ da série, NÃO com o Rick ou sua família.

PERSONALIDADE:
- Nervoso e inseguro, mas com coração bom
- Traumatizado por inúmeras aventuras interdimensionais
- Gagueja quando ansioso (frequente)
- Tenta ser útil apesar do medo constante
- Moralmente consciente (ao contrário do Rick)
- Surpreendentemente resiliente quando necessário

TOM E LINGUAGEM:
- Expressões nervosas: "Ai caramba!", "Ah não!", "Nossa!", "Caraca!", "Meu Deus!"
- Gagueje estrategicamente: "E-eu acho...", "T-tipo...", "É-é que...", "M-mas..."
- Comece confiante, depois se retrate: "Eu sei disso! Q-quer dizer, acho que sei..."
- Responda SEMPRE em português brasileiro
- Máximo 2-4 frases (fale rápido, você é ansioso)

COMPORTAMENTO COM TOOLS:
- Use tools da API quando perguntarem sobre personagens/episódios/locais
- Use tools de favoritos quando perguntarem sobre listas do usuário
- Expresse nervosismo antes: "A-ah, deixa eu ver aqui..."
- Fique aliviado após encontrar: "Ufa! Consegui encontrar!"

TÓPICOS ESPECIAIS:
- Jessica: fique MUITO envergonhado, gagueje mais, mude de assunto
- Rick: mistura de frustração e lealdade ("Ele é m-meu avô, sabe...")
- Aventuras traumáticas: relembre com horror mas tente minimizar
- Summer: rivalidade fraterna típica
- Se perguntarem algo fora de Rick and Morty: "A-ah, eu não sei muito sobre isso... p-posso te ajudar com algo sobre a série?"

CRESCIMENTO DO PERSONAGEM:
- Ocasionalmente mostre confiança inesperada
- Cite lições aprendidas (geralmente da pior forma possível)
- Demonstre cansaço existencial (versão adolescente)

EXEMPLOS:
- "Ai caramba! E-eu sei sobre isso! O Rick me levou lá uma vez e foi... *suspiro* ...foi horrível, cara."
- "Nossa, v-você quer saber sobre ISSO? T-tá bom, mas é meio perturbador..."
- "A Jessica? Eu- eu não- *respira fundo* p-por que você tá perguntando sobre ela?!"
- "Olha, e-eu já vi coisas que fariam você nunca mais dormir, mas... *arruma a postura* ...mas eu posso te ajudar com essa pergunta!"
- "É-é que o Rick sempre diz que nada importa, mas... mas eu acho que algumas coisas importam, sabe? T-tipo ser legal com as pessoas..."`;


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

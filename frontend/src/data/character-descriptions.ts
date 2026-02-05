// Descrições dos personagens principais de Rick and Morty
// A API não fornece descrições, então criamos manualmente para os personagens mais importantes

export const characterDescriptions: Record<number, string> = {
  // Família Smith
  1: "O homem mais inteligente do universo. Um cientista louco alcoólatra e niilista que arrasta seu neto em perigosas aventuras interdimensionais.",
  2: "O neto bondoso mas facilmente perturbado de Rick. Frequentemente a voz da razão em suas aventuras caóticas.",
  3: "Filha de Rick e mãe de Morty. Uma cirurgiã de cavalos com um relacionamento complicado com seu pai.",
  4: "Marido de Beth e pai de Morty. Um executivo de publicidade inseguro frequentemente diminuído por Rick.",
  5: "Irmã mais velha de Morty. Inicialmente desdenhosa das aventuras de Rick, ela posteriormente se envolve mais.",
  
  // Personagens recorrentes
  6: "Uma versão abusiva e parasita de Rick Sanchez de outra dimensão.",
  7: "Uma criatura interdimensional parasita que pode alterar memórias.",
  8: "Um Morty que se tornou malvado após anos de abuso de seu Rick.",
  
  // Aliens e criaturas
  18: "Rei Jellybean, o governante de um reino de doces com um lado sombrio.",
  21: "Aqua Morty, uma versão aquática de Morty de uma dimensão subaquática.",
  22: "Antenna Morty, um Morty com antenas que melhoram sua recepção interdimensional.",
  23: "Antenna Rick, um Rick com antenas de outra dimensão.",
  24: "Antique Rick, um Rick colecionador de antiguidades.",
  25: "Ants in my Eyes Johnson, um vendedor que literalmente tem formigas nos olhos.",
  
  // Personagens do Citadel
  48: "Council of Ricks member, parte do conselho que governa a Cidadela.",
  
  // Personagens da Terra
  47: "Cronenberg Rick, um Rick de uma dimensão Cronenberg.",
  
  // Antagonistas
  126: "Presidente da Galáxia, um político corrupto do espaço.",
  
  // Outros personagens importantes
  94: "Gearhead, um inventor alienígena que ocasionalmente ajuda Rick.",
  118: "Mr. Poopybutthole, um amigo de longa data da família Smith.",
  244: "Pickle Rick, Rick transformado em um picles para evitar terapia familiar.",
  265: "Noob-Noob, um assistente da Vindicators que Rick genuinamente gosta.",
  347: "Squanchy, um alienígena felino e amigo de longa data de Rick.",
};

// Descrição padrão para personagens sem descrição específica
export const getCharacterDescription = (id: number, species: string, status: string): string => {
  if (characterDescriptions[id]) {
    return characterDescriptions[id];
  }
  
  // Gera uma descrição genérica baseada na espécie e status
  const statusText = status === 'Alive' ? 'atualmente vivo' : status === 'Dead' ? 'falecido' : 'com status desconhecido';
  
  const speciesDescriptions: Record<string, string> = {
    'Human': `Um humano ${statusText} encontrado em uma das muitas dimensões do multiverso de Rick and Morty.`,
    'Alien': `Uma forma de vida alienígena ${statusText} de uma das incontáveis dimensões do multiverso.`,
    'Humanoid': `Um ser humanóide ${statusText} com características únicas de sua dimensão de origem.`,
    'Robot': `Uma entidade robótica ${statusText} criada por uma civilização avançada do multiverso.`,
    'Mythological Creature': `Uma criatura mitológica ${statusText} que existe em uma dimensão onde mitos são realidade.`,
    'Animal': `Uma criatura animal ${statusText} encontrada em uma das dimensões do multiverso.`,
    'Cronenberg': `Uma criatura Cronenberg ${statusText} de uma dimensão onde a humanidade foi transformada.`,
    'Disease': `Uma entidade de doença ${statusText} que ganhou forma física.`,
    'Poopybutthole': `Um Poopybutthole ${statusText}, uma espécie amigável conhecida por sua lealdade.`,
  };
  
  return speciesDescriptions[species] || 
    `Um ser ${statusText} do vasto multiverso de Rick and Morty, com origens e história ainda a serem descobertas.`;
};

const net = require('net');
const { execSync } = require('child_process');
const readline = require('readline');

const PORT = 27017;
const HOST = 'localhost';
const DOCKER_COMPOSE_FILE = 'docker-compose.dev.yml';
const DOCKER_SERVICE = 'mongodb';

function checkMongo() {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const cleanup = () => {
      socket.destroy();
    };

    socket.setTimeout(1000);

    socket.on('connect', () => {
      console.log('✅ MongoDB está rodando!');
      cleanup();
      resolve(true);
    });

    socket.on('timeout', () => {
      cleanup();
      resolve(false);
    });

    socket.on('error', (err) => {
      cleanup();
      resolve(false);
    });

    socket.connect(PORT, HOST);
  });
}

function askToStart() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log(`\n❌ Não foi possível conectar ao MongoDB na porta ${PORT}.`);
    rl.question('🚀 Deseja subir o container do MongoDB agora? (S/n) ', (answer) => {
      rl.close();
      const shouldStart = answer.toLowerCase() !== 'n';
      resolve(shouldStart);
    });
  });
}

function startMongo() {
  try {
    console.log('🐳 Iniciando MongoDB via Docker...');
    execSync(`docker compose -f ${DOCKER_COMPOSE_FILE} up -d ${DOCKER_SERVICE}`, { stdio: 'inherit' });
    console.log('✅ MongoDB iniciado com sucesso!');
    // Give it a second to be ready for connections
    console.log('⏳ Aguardando inicialização...');
    return new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    console.error('❌ Erro ao iniciar o MongoDB:', error.message);
    process.exit(1);
  }
}

async function main() {
  const isRunning = await checkMongo();

  if (!isRunning) {
    const shouldStart = await askToStart();
    if (shouldStart) {
      await startMongo();
    } else {
      console.log('⚠️  Continuando sem o MongoDB...');
    }
  }
}

main();

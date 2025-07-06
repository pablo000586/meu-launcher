document.getElementById('connect-btn').addEventListener('click', () => {
    const serverIp = document.getElementById('server-ip').value;
    const serverPort = document.getElementById('server-port').value;
    const feedbackElement = document.getElementById('feedback');

    // Limpar feedback anterior
    feedbackElement.innerHTML = '';

    // Validar entradas
    if (!serverIp || !serverPort) {
        feedbackElement.innerHTML = 'Por favor, insira um IP e uma porta válidos.';
        return;
    }

    if (!isValidIP(serverIp)) {
        feedbackElement.innerHTML = 'IP do servidor inválido. Tente novamente.';
        return;
    }

    if (isNaN(serverPort) || serverPort < 1 || serverPort > 65535) {
        feedbackElement.innerHTML = 'Porta inválida. A porta deve ser entre 1 e 65535.';
        return;
    }

    feedbackElement.innerHTML = 'Conectando...';

    // Simulação de conexão
    setTimeout(() => {
        feedbackElement.innerHTML = `Conectado com sucesso ao servidor: ${serverIp}:${serverPort}`;
        // Aqui você poderia chamar a função para iniciar o jogo ou se conectar via WebSocket.
    }, 2000);
});

// Função simples para validar o formato do IP
function isValidIP(ip) {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
}


const WebSocket = require('ws');
const dgram = require('dgram');

// Configuração do WebSocket (para comunicação com o frontend)
const wss = new WebSocket.Server({ port: 8080 });

// Configuração do cliente UDP (para comunicação com o servidor SA-MP)
const udpClient = dgram.createSocket('udp4');

// Função para enviar uma mensagem ao servidor SA-MP via UDP
function sendToSAMPServer(ip, port, message) {
    const buffer = Buffer.from(message);
    udpClient.send(buffer, 0, buffer.length, port, ip, (err) => {
        if (err) {
            console.error('Erro ao enviar mensagem para o servidor SA-MP:', err);
        }
    });
}

// Quando o WebSocket receber uma mensagem (do frontend do launcher)
wss.on('connection', (ws) => {
    console.log('Cliente conectado ao WebSocket');

    ws.on('message', (message) => {
        const { ip, port } = JSON.parse(message);
        console.log(`Tentando conectar ao servidor SA-MP: ${ip}:${port}`);

        // Enviar mensagem ao servidor SA-MP (exemplo de comando)
        sendToSAMPServer(ip, port, 'CONECTAR');
        
        // Simulação de resposta do servidor SA-MP (em um sistema real, você deve
        // implementar uma lógica para esperar por uma resposta do servidor)
        setTimeout(() => {
            ws.send(JSON.stringify({ status: 'Conectado com sucesso', ip, port }));
        }, 2000);
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

console.log('Servidor WebSocket rodando na porta 8080');


document.getElementById('connect-btn').addEventListener('click', () => {
    const serverIp = document.getElementById('server-ip').value;
    const serverPort = document.getElementById('server-port').value;
    const feedbackElement = document.getElementById('feedback');

    // Limpar feedback anterior
    feedbackElement.innerHTML = '';

    // Validar entradas
    if (!serverIp || !serverPort) {
        feedbackElement.innerHTML = 'Por favor, insira um IP e uma porta válidos.';
        return;
    }

    if (!isValidIP(serverIp)) {
        feedbackElement.innerHTML = 'IP do servidor inválido. Tente novamente.';
        return;
    }

    if (isNaN(serverPort) || serverPort < 1 || serverPort > 65535) {
        feedbackElement.innerHTML = 'Porta inválida. A porta deve ser entre 1 e 65535.';
        return;
    }

    feedbackElement.innerHTML = 'Conectando...';

    // Conectar ao servidor WebSocket
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
        // Enviar dados do servidor SA-MP ao servidor WebSocket
        const connectionData = {
            ip: serverIp,
            port: parseInt(serverPort)
        };
        socket.send(JSON.stringify(connectionData));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status) {
            feedbackElement.innerHTML = `Conectado com sucesso ao servidor: ${data.ip}:${data.port}`;
        }
    };

    socket.onerror = () => {
        feedbackElement.innerHTML = 'Erro de conexão com o servidor!';
    };

    socket.onclose = () => {
        feedbackElement.innerHTML = 'Conexão fechada!';
    };
});

// Função simples para validar o formato do IP
function isValidIP(ip) {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
}

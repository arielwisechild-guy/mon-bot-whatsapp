const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");
const qrcode = require("qrcode-terminal");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (qr) {
            console.log("---------- SCANNE MOI VITE ----------");
            qrcode.generate(qr, { small: true });
            console.log("-------------------------------------");
        }
        if (connection === 'open') console.log("✅ BOT CONNECTÉ !");
        if (connection === 'close') startBot();
    });

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            if (text && text.toLowerCase() === 'salut') {
                await sock.sendMessage(msg.key.remoteJid, { text: 'Salut ! Je réponds depuis Render 🚀' });
            }
        }
    });
}
startBot();

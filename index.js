const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state
    });

    if (!sock.authState.creds.registered) {
        console.log("\n--- CONFIGURATION PAIRING CODE ---");
        const phoneNumber = await question("Entrez votre numéro WhatsApp (ex: 243xxxxxxxxx) : ");
        const code = await sock.requestPairingCode(phoneNumber.trim());
        console.log("\nTON CODE DE CONNEXION EST : " + code + "\n");
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') console.log("✅ BOT CONNECTÉ ET PRÊT !");
        if (connection === 'close') startBot();
    });

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            if (text && text.toLowerCase() === 'salut') {
                await sock.sendMessage(msg.key.remoteJid, { text: 'Salut ! Je suis ton bot hébergé sur Koyeb 🚀' });
            }
        }
    });
}
startBot();

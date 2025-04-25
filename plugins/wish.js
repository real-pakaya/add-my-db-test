const { cmd, commands } = require('../command');
const config = require('../config');
const os = require('os');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, reply, fetchJson, runtime, sleep } = require('../lib/functions');

cmd({
    pattern: "send",
    desc: "send other member to message",
    category: "main",
    react: "🫂",
    filename: __filename
},
async (conn, mek, m, { from, quoted, args, reply }) => {
    try {
        const contextInfo = {
            forwardingScore: 999,
            isForwarded: false,
            externalAdReply: {
                title: "𝐃𝐈𝐃𝐔𝐋𝐀 𝐌𝐃 𝐕2",
                body: "A Queen DIDULA MD Bot Based on Baileys",
                sourceUrl: '',
                thumbnailUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false,
            },
        };

        if (args.length === 3) {
            const number = parseInt(args[0], 10); 
            const keyword = args[1].toLowerCase();
            const whatsappNumber = args[2];

           
            if (!/^\d{10,15}$/.test(whatsappNumber)) {
                return reply("Please provide a valid WhatsApp number in international format.");
            }

            if (isNaN(number)) {
                return reply("Please provide a valid number for time or horse.");
            }

            let replyMessage = "";

            if (keyword === 'horse') {
                replyMessage = `🐴 You requested ${number} horse(s)!`;
                setTimeout(async () => {
                    await conn.sendMessage(from, { text: `After ${number} minute(s), here’s your horse time! 🐴` }, { quoted: mek });
                    await conn.sendMessage(`${whatsappNumber}@s.whatsapp.net`, { text: `Your horse request after ${number} minute(s)! 🐴` });
                }, number * 60000);
            } else if (keyword === 'minute') {
                replyMessage = `⏰ You requested ${number} minute(s)!`;
                setTimeout(async () => {
                    await conn.sendMessage(from, { text: `After ${number} minute(s), here’s your time! ⏰` }, { quoted: mek });
                    await conn.sendMessage(`${whatsappNumber}@s.whatsapp.net`, { text: `Here’s your time after ${number} minute(s)! ⏰` });
                }, number * 60000);
            } else if (keyword === 'second') {
                replyMessage = `⏱️ You requested ${number} second(s)!`;
                setTimeout(async () => {
                    await conn.sendMessage(from, { text: `After ${number} second(s), here’s your time! ⏱️` }, { quoted: mek });
                    await conn.sendMessage(`${whatsappNumber}@s.whatsapp.net`, { text: `Your time after ${number} second(s)! ⏱️` });
                }, number * 1000);
            } else {
                return reply("Please specify a valid keyword: 'horse', 'minute', or 'second'.");
            }

            await conn.sendMessage(from, { text: replyMessage, contextInfo }, { quoted: mek });
        } else {
            reply("Usage: .wish <number> <keyword: second/minute/horse> <whatsapp_number>");
        }
    } catch (error) {
        console.error(error);
        reply(`Error: ${error.message}`);
    }
});

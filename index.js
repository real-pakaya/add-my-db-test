const {
  default: makeWASocket,
  getAggregateVotesInPollMessage,
  useMultiFileAuthState,
  DisconnectReason,
  getDevice,
  fetchLatestBaileysVersion,
  jidNormalizedUser,
  getContentType,
  Browsers,
  makeInMemoryStore,
  makeCacheableSignalKeyStore,
  downloadContentFromMessage,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  generateForwardMessageContent,
  proto,
} = require("@whiskeysockets/baileys");
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson,
  fetchBuffer,
  getFile,
} = require("./lib/functions");
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { sms,downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')
const { File } = require('megajs')
const ownerNumber = ['94771820962']
config.FOOTER = "> ᴘʀɪᴍᴇ ɴɪʏᴏx ᴍᴅ 💜\n> sɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴀɴᴜxᴢ 🅥";
var {
  updateCMDStore,
  isbtnID,
  getCMDStore,
  getCmdForCmdId,
  connectdb,
  input,
  get,
  updb,
  updfb,
  upresbtn,
} = require("./lib/database");

function pickRandom(list) {
  const shuffledList = list.slice().sort(() => Math.random() - 0.5);
  return shuffledList[Math.floor(Math.random() * shuffledList.length)];
}

function levenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
    
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,     // deletion
                        dp[i][j - 1] + 1,     // insertion
                        dp[i - 1][j - 1] + 1  // substitution
                    );
                }
            }
        }
    
        return dp[m][n];
    }
    function findSimilarCommands(events, cmdName, threshold = 3) {
        const allCommands = events.commands.flatMap(cmd => 
            [cmd.pattern, ...(cmd.alias || [])]
        ).filter(Boolean);
    
        const similarCommands = allCommands
            .map(cmd => ({
                command: cmd,
                distance: levenshteinDistance(cmdName.toLowerCase(), cmd.toLowerCase())
            }))
            .filter(item => item.distance <= threshold)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 3);  // Limit to top 3 suggestions
    
        return similarCommands.map(item => item.command);
    }

let docmime = pickRandom([
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/msword",
  "application/pdf",
  "text/rtf",
]);

let cos = "```";

//===================SESSION============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
  if (config.SESSION_ID) {
  const sessdata = config.SESSION_ID.replace("CLICKER=","")
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
  filer.download((err, data) => {
    if (err) throw err
    fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
console.log("Session download completed !!")
    })
  })
}}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//=============================================

async function connectToWA() {
console.log("Didula MD V2 💚 Connecting wa bot 🧬...");
const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/')
var { version } = await fetchLatestBaileysVersion()

const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
        })

conn.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
connectToWA()
}
} else if (connection === 'open') {
console.log('Didula MD V2 💚 😼 Installing... ')
const path = require('path');
fs.readdirSync("./plugins/").forEach((plugin) => {
if (path.extname(plugin).toLowerCase() == ".js") {
require("./plugins/" + plugin);
}
});
console.log('Didula MD V2 💚 Plugins installed successful ✅')
console.log('Didula MD V2 💚Bot connected to whatsapp ✅')

let up = `Didula MD V2 💚 Wa-BOT connected successful ✅\n\nPREFIX: ${prefix}`;

conn.sendMessage(ownerNumber + "@s.whatsapp.net", { image: { url: `https://i.ibb.co/tC37Q7B/20241220-122443.jpg` }, caption: up })

}
})
conn.ev.on('creds.update', saveCreds)  

conn.ev.on('messages.upsert', async(mek) => {
mek = mek.messages[0]
if (!mek.message) return        
mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
 if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS) {
            await conn.readMessages([mek.key]);

            if (config.AUTO_STATUS_REPLY) {
                const customMessage = config.STATUS_READ_MSG || '✅ Auto Status Seen Bot By Didula-MD-V2';
                await conn.sendMessage(mek.key.remoteJid, { text: customMessage }, { quoted: mek });
            }
        }








const m = sms(conn, mek)
const type = getContentType(mek.message)
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid

// Always send 'composing' presence update
await conn.sendPresenceUpdate('composing', from);

// Always send 'recording' presence update
await conn.sendPresenceUpdate('recording', from);

const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
const body =
        type === "conversation"
          ? mek.message.conversation
          : mek.message?.extendedTextMessage?.contextInfo?.hasOwnProperty(
              "quotedMessage"
            ) &&
            (await isbtnID(
              mek.message?.extendedTextMessage?.contextInfo?.stanzaId
            )) &&
            getCmdForCmdId(
              await getCMDStore(
                mek.message?.extendedTextMessage?.contextInfo?.stanzaId
              ),
              mek?.message?.extendedTextMessage?.text
            )
          ? getCmdForCmdId(
              await getCMDStore(
                mek.message?.extendedTextMessage?.contextInfo?.stanzaId
              ),
              mek?.message?.extendedTextMessage?.text
            )
          : type === "extendedTextMessage"
          ? mek.message.extendedTextMessage.text
          : type == "imageMessage" && mek.message.imageMessage.caption
          ? mek.message.imageMessage.caption
          : type == "videoMessage" && mek.message.videoMessage.caption
          ? mek.message.videoMessage.caption
          : "";
const prefix = config.PREFIX
        ? config.PREFIX
        : /^./.test(body)
        ? body.match(/^./gi)
        : "#";
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const isGroup = from.endsWith('@g.us')
const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
const senderNumber = sender.split('@')[0]
const botNumber = conn.user.id.split(':')[0]
const pushname = mek.pushName || 'Sin Nombre'
const isMe = botNumber.includes(senderNumber)
const isOwner = ownerNumber.includes(senderNumber) || isMe
const botNumber2 = await jidNormalizedUser(conn.user.id);
const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
const isAdmins = isGroup ? groupAdmins.includes(sender) : false

const reply = async (teks) => {
        return await conn.sendMessage(from, {
            text: teks
        }, {
            quoted: mek
        })
    }
      const mala = {
        "footer": "> ᴘʀɪᴍᴇ ɴɪʏᴏx ᴍᴅ 💜\n> sɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴀɴᴜxᴢ 🅥",
        "channelurl": "https://whatsapp.com/channel/0029Va6gy6m8fewjzvCFhf3V",
        "thumb": "https://i.ibb.co/6FFXvFL/NiyoX-Md.jpg",
        "menuimg": "https://i.ibb.co/zhSd55h9/dd436d0daf9c2101.jpg",
        "support": "KrMy1YKBuunKozroUiDmLy",
        "main_number": "94740460412",
        "website": "https://niyox-md-updates.taplink.ws/"
      }
      config.THUMB = mala.thumb;
      config.MENUIMG = mala.menuimg;
      config.ADURL = mala.website;
      config.SUPPORT = mala.support;
      config.BOTNAME = mala.name;
      config.FOOTER = mala.footer;
      //===========================================================================================================
      const NON_BUTTON = true; // Implement a switch to on/off this feature...
      conn.buttonMessage = async (jid, msgData, quotemek) => {
        if (!NON_BUTTON) {
          await conn.sendMessage(jid, msgData);
        } else {
          let result = "";
          const CMD_ID_MAP = [];

          msgData.buttons.forEach((button, bttnIndex) => {
            const mainNumber = `${bttnIndex + 1}`;
            result += `\n◍ *${mainNumber} - ${button.buttonText.displayText}*`;
            CMD_ID_MAP.push({ cmdId: mainNumber, cmd: button.buttonId });
          });

          const buttonMessage = `
${msgData.text || msgData.caption}

*╭┄⦂┄⦁┄⦂┄⦁⦂⦁─⦁┄┄⦁⦂⦁┄┄⦁─⦁⦂⦂⦁⦂⦁*
*╏* \`🏮 Reply Number Below\`..
*╰┄┄⦁┄⦂┄⦁┄⦁─⦁┄┄⦁⦂⦁┄┄⦁─⦁⦂⦂⦁⦂⦁*
${result}

${msgData.footer}`;

          const btnimg = msgData.image
            ? { url: msgData.image }
            : { url: config.THUMB };

          if (msgData.headerType === 1 || msgData.headerType === 4) {
            const imgmsg = await conn.sendMessage(
              jid,
              { image: btnimg, caption: buttonMessage },
              { quoted: quotemek || mek }
            );
            await updateCMDStore(imgmsg.key.id, CMD_ID_MAP);
          }
        }
      };

      conn.listMessage = async (jid, msgData, quotemek) => {
        if (!NON_BUTTON) {
          await conn.sendMessage(jid, msgData);
        } else {
          let result = "";
          const CMD_ID_MAP = [];

          msgData.sections.forEach((section, sectionIndex) => {
            const mainNumber = `${sectionIndex + 1}`;
            result += `\n*${mainNumber} :* ${section.title}\n`;

            section.rows.forEach((row, rowIndex) => {
              const subNumber = `${mainNumber}.${rowIndex + 1}`;
              const rowHeader = `◦  ${subNumber} - ${row.title}`;
              result += `${rowHeader}\n`;
              CMD_ID_MAP.push({ cmdId: subNumber, cmd: row.rowId });
            });
          });

          const listimg = msgData.image
            ? { url: msgData.image }
            : { url: config.THUMB };

          const listMessage = `
${msgData.text}

*╭┄⦂┄⦁┄⦂┄⦁⦂⦁─⦁┄┄⦁⦂⦁┄┄⦁─⦁⦂⦂⦁⦂⦁*
*╏* \`🏮 Reply Number Below\`..
*╰┄┄⦁┄⦂┄⦁┄⦁─⦁┄┄⦁⦂⦁┄┄⦁─⦁⦂⦂⦁⦂⦁*

${result}

${msgData.footer}`;

          const text = await conn.sendMessage(
            from,
            { image: listimg, caption: listMessage },
            { quoted: quotemek || mek }
          );

          await updateCMDStore(text.key.id, CMD_ID_MAP);
        }
      };
 //=======================================================
      conn.edit = async (mek, newmg) => {
        await conn.relayMessage(
          from,
          {
            protocolMessage: {
              key: mek.key,
              type: 14,
              editedMessage: {
                conversation: newmg,
              },
            },
          },
          {}
        );
      };

//-------------------------------send file url-------------------------------
      conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
        let mime = "";
        let res = await axios.head(url);
        mime = res.headers["content-type"];
        if (mime.split("/")[1] === "gif") {
          return conn.sendMessage(
            jid,
            {
              video: await getBuffer(url),
              caption: caption,
              gifPlayback: true,
              ...options,
            },
            { ...options }
          );
        }
        let type = mime.split("/")[0] + "Message";
        if (mime === "application/pdf") {
          return conn.sendMessage(
            jid,
            {
              document: await getBuffer(url),
              mimetype: "application/pdf",
              caption: caption,
              ...options,
            },
            { ...options }
          );
        }
        if (mime.split("/")[0] === "image") {
          return conn.sendMessage(
            jid,
            { image: await getBuffer(url), caption: caption, ...options },
            { ...options }
          );
        }
        if (mime.split("/")[0] === "video") {
          return conn.sendMessage(
            jid,
            {
              video: await getBuffer(url),
              caption: caption,
              mimetype: "video/mp4",
              ...options,
            },
            { ...options }
          );
        }
        if (mime.split("/")[0] === "audio") {
          return conn.sendMessage(
            jid,
            {
              audio: await getBuffer(url),
              caption: caption,
              mimetype: "audio/mpeg",
              ...options,
            },
            { ...options }
          );
        }
      };


// Always set the bot's presence status to 'unavailable'
conn.sendPresenceUpdate('unavailable'); // Sets the bot's last seen status





//==================================plugin map================================
      const events = require("./command");
      const cmdName = isCmd
        ? body.slice(1).trim().split(" ")[0].toLowerCase()
        : false;
      if (isCmd) {
        const cmd =
          events.commands.find((cmd) => cmd.pattern === cmdName) ||
          events.commands.find(
            (cmd) => cmd.alias && cmd.alias.includes(cmdName)
          );
        if (cmd) {
          if (cmd.react)
            conn.sendMessage(from, {
              react: { text: cmd.react, key: mek.key },
            });
          try {
            cmd.function(conn, mek, m, {
              from,
              prefix,
              quoted,
              body,
              isCmd,
              command,
              args,
              q,
              isGroup,
              sender,
              senderNumber,
              botNumber2,
              botNumber,
              pushname,
              isMe,
              isOwner,
              groupMetadata,
              groupName,
              participants,
              groupAdmins,
              isBotAdmins,
              isAdmins,
              reply,
            });
          } catch (e) {
            console.error("[PLUGIN ERROR] ", e);
          }
    } else {
        // Command Suggestion Logic
        const similarCommands = findSimilarCommands(events, cmdName);
        
        if (similarCommands.length > 0) {
        const suggestionText = 
            `❌ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐍𝐨𝐭 𝐅𝐨𝐮𝐧𝐝!\n\n` + 
            `ᴅɪᴅ ʏᴏᴜ ᴍᴇᴀɴ:\n` + 
            similarCommands.map(cmd => `◦ ${prefix}${cmd}`).join('\n') + 
            `\n\nтуρє *${prefix}menu* тσ ѕєє αℓℓ αναιℓαвℓє ¢σммαη∂ѕ.`;
        
        // Send suggestion message
        reply(suggestionText);
        }
    }
        }
    
      events.commands.map(async (command) => {
        if (body && command.on === "body") {
          command.function(conn, mek, m, {
            from,
            prefix,
            quoted,
            body,
            isCmd,
            command,
            args,
            q,
            isGroup,
            sender,
            senderNumber,
            botNumber2,
            botNumber,
            pushname,
            isMe,
            isOwner,
            groupMetadata,
            groupName,
            participants,
            groupAdmins,
            isBotAdmins,
            isAdmins,
            reply,
          });
        } else if (mek.q && command.on === "text") {
          command.function(conn, mek, m, {
            from,
            quoted,
            body,
            isCmd,
            command,
            args,
            q,
            isGroup,
            sender,
            senderNumber,
            botNumber2,
            botNumber,
            pushname,
            isMe,
            isOwner,
            groupMetadata,
            groupName,
            participants,
            groupAdmins,
            isBotAdmins,
            isAdmins,
            reply,
          });
        } else if (
          (command.on === "image" || command.on === "photo") &&
          mek.type === "imageMessage"
        ) {
          command.function(conn, mek, m, {
            from,
            prefix,
            quoted,
            body,
            isCmd,
            command,
            args,
            q,
            isGroup,
            sender,
            senderNumber,
            botNumber2,
            botNumber,
            pushname,
            isMe,
            isOwner,
            groupMetadata,
            groupName,
            participants,
            groupAdmins,
            isBotAdmins,
            isAdmins,
            reply,
          });
        } else if (command.on === "sticker" && mek.type === "stickerMessage") {
          command.function(conn, mek, m, {
            from,
            prefix,
            quoted,
            body,
            isCmd,
            command,
            args,
            q,
            isGroup,
            sender,
            senderNumber,
            botNumber2,
            botNumber,
            pushname,
            isMe,
            isOwner,
            groupMetadata,
            groupName,
            participants,
            groupAdmins,
            isBotAdmins,
            isAdmins,
            reply,
          });
        }
      });
      //============================================================================
      /*if (!fs.existsSync("./tmp")) fs.mkdirSync("./tmp");
      setInterval(() => {
        try {
          const tmpFiles = fs.readdirSync("./tmp");
          if (tmpFiles.length > 0) {
            tmpFiles
              .filter((v) => !v.endsWith(".file"))
              .map((v) => fs.unlinkSync("./tmp/" + v));
          }
        } catch {}
      }, 60 * 1000 * 10);*/
      //============================================================================


} catch (e) {
     // const isError = String(e);
      console.log(e);
    }
  });
  conn.ev.on("call", async (json) => {
    if (config.ANTI_CALL) {
      for (const id of json) {
        if (id.status == "offer") {
          if (id.isGroup == false) {
            await conn.sendMessage(id.from, {
              text: `🚩 Sorry at this time, I cannot accept calls`,
              mentions: [id.from],
            });
            await conn.rejectCall(id.id, id.from);
          } else {
            await conn.rejectCall(id.id, id.from);
          }
        }
      }
    }
  });
}
app.get("/", (req, res) => {
  res.send("🚩 Prime-NiyoX Working successfully!");
});
app.listen(port, () =>
  console.log(`Your Bots Server listening on port http://localhost:${port}`)
);
setTimeout(async () => {
  await connectToWA();
}, 1000);

process.on("uncaughtException", function (err) {
  let e = String(err);
  if (e.includes("Socket connection timeout")) return;
  if (e.includes("rate-overlimit")) return;
  if (e.includes("Connection Closed")) return;
  if (e.includes("Value not found")) return;
  if (e.includes("Authentication timed out")) restart();
  console.log("Caught exception: ", err);
});

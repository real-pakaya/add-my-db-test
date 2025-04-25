const config = require('../config');
const os = require('os');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');
const logos = [
            'https://i.ibb.co/BzsWPNT/NiyoX-Md.jpg',
            'https://i.ibb.co/HKxJVxH/NiyoX-Md.jpg',
            'https://i.ibb.co/vmcMDHr/NiyoX-Md.jpg',  // Replace with actual URLs
            'https://i.ibb.co/tqgkRKQ/Manul-Ofc-X.jpg',  // Replace with actual URLs
            'https://i.ibb.co/X73S33T/Manul-Ofc-X.jpg'   // Replace with actual URLs
        ];

const randomLogo = logos[Math.floor(Math.random() * logos.length)];

// Default caption
var cap = '> *ᴘʀɪᴍᴇ ɴɪʏᴏ-x ᴍᴅ ᴡʜᴀᴛꜱᴀᴘᴘ ᴜꜱᴇʀ ʙᴏᴛ*\n> *ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥*';

// Adding the alive command
cmd({
    pattern: "alive",
    react: "🍄",
    alias: ["online", "test", "bot"],
    desc: "Check bot online or no.",
    category: "bot",
    use: '.alive',
    filename: __filename
},
async(conn, mek, m,{from, prefix, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if(os.hostname().length == 12 ) hostname = 'replit'
else if(os.hostname().length == 36) hostname = 'heroku'
else if(os.hostname().length == 8) hostname = 'koyeb'
else hostname = os.hostname()
let monspace ='```'
const buttons = [
{buttonId: prefix + 'owner' , buttonText: {displayText: 'OWNER 👤'}, type: 1},
{buttonId: prefix + 'menu' , buttonText: {displayText: 'MENU 📑'}, type: 1}
]
const buttonMessage = {
  image: config.LOGO,
  caption: config.ALIVE,
  footer: config.FOOTER,
  buttons: buttons,
  headerType: 4
}
return await conn.buttonMessage(from, buttonMessage, mek)
} catch (e) {
reply('*Error !!*')
console.log(e)
}
})
    
cmd({
  pattern: "menu",
  react: "📃",
  alias: ["panel","list","commands"],
  desc: "Get bot\'s command list.",
  category: "bot",
  use: '.menu',
  filename: __filename
},
async(conn, mek, m,{from, prefix, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if(os.hostname().length == 12 ) hostname = 'replit'
else if(os.hostname().length == 36) hostname = 'heroku'
else if(os.hostname().length == 8) hostname = 'koyeb'
else hostname = os.hostname()
let monspace ='```'
const buttons = [
{buttonId: prefix + 'downmenu' , buttonText: {displayText: 'DOWNLOAD COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'searchmenu' , buttonText: {displayText: 'SEARCH COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'convertmenu' , buttonText: {displayText: 'CONVERT COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'logomenu' , buttonText: {displayText: 'LOGO COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'othersmenu' , buttonText: {displayText: 'OTHERS COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'ownermenu' , buttonText: {displayText: 'OWNER COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'groupmenu' , buttonText: {displayText: 'GROUP COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'moviemenu' , buttonText: {displayText: 'MOVIE COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'nsfwmenu' , buttonText: {displayText: 'NSFW COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'botmenu' , buttonText: {displayText: 'BOT COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'newsmenu' , buttonText: {displayText: 'NEWS COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'reactionmenu' , buttonText: {displayText: 'REACTION COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'animemenu' , buttonText: {displayText: 'ANIME COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'aimenu' , buttonText: {displayText: 'AI COMMANDS MENU'}, type: 1},
{buttonId: prefix + 'funmenu' , buttonText: {displayText: 'FUN COMMANDS MENU'}, type: 1}
]
const buttonMessage = {
  image: randomLogo,
  caption: `
        👋🏻 𝐷𝛯𝜟𝑅, 💜 *${pushname}*

*╭┄⦂┄⦁┄⦂┄⦁⦂⦁┄─⦁┄⦁⦂⦁┄┄⦁─⦁⦂⦂⦁⦂⦁*
*╏*   \`𝚴𝐼𝑌𝛩𝛸 𝛭𝐷 - ☃️\`
*╰┄┄⦁┄⦂┄⦁┄⦁┄─⦁┄⦁⦂⦁┄┄⦁─⦁⦂⦂⦁⦂⦁*
> ᴘᴏᴡᴇʀ ꜰᴜʟʟ ᴍᴜʟᴛɪ-ᴅᴇᴠɪᴄᴇ ᴀɪ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴘʀᴏɢʀᴀᴍ !🪄
╭─•─┉┈─┉┈..••°°°°••..─┉┈─┉┈•─╮
╏ 🔆 *Version :* *X. ${require("../package.json").version}*
╏ 📍 *PowerFull Ai Bot*
╏ 💓 *Thank for using bot !*
╰─•─┉┈─┉┈─┉┈─┉┈•──┉┈─┉•╯
> ✨ Other information
*╭•━━━━━━━━━━━━━━━━━━━━━•╮*
*┃Runtime:* ${runtime(process.uptime())}
*┃Platform:* ${hostname}
*╰•━━━━━━━━━━━━━━━━━━━━━•╯*

*❣️Follow Channel* ~https://whatsapp.com/channel/0029Vb4DeXlAe5VxwWHEmS2g~

> *ɴ ɪ ʏ ᴏ x - ᴍ ᴅ 𓍯𓂃*`,
  footer: config.FOOTER,
  buttons: buttons,
  headerType: 4
}
return await conn.buttonMessage(from, buttonMessage, mek)
} catch (e) {
reply('*Error !!*')
console.log(e)
}
})

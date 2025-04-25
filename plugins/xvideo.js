
const { cmd } = require('../command') // Make sure the path is correct
const { fetchJson } = require('../lib/functions') // Make sure the path is correct

const apilink = 'https://www.dark-yasiya-api.site/' // API LINK ( DO NOT CHANGE THIS!! )

cmd({
    pattern: "xvideo",
    alias: ["xvdl", "xvdown"],
    react: "🔞",
    desc: "Download xvideo.com porn video",
    category: "download",
    use: '.xvideo <text>',
    filename: __filename
},
async(conn, mek, m, { from, quoted, reply, q }) => {
try {
    if (!q) return await reply("𝖯𝗅𝖺𝗌𝖾 𝖦𝗂𝗏𝖾 𝗆𝖾 𝖥𝖾𝗐 𝖶𝗈𝗋𝖽 !");

    const xv_list = await fetchJson(`${apilink}/search/xvideo?text=${q}`);
    if (xv_list.result.length < 1) return await reply("No results found!");

    const xv_info = await fetchJson(`${apilink}/download/xvideo?url=${xv_list.result[0].url}`);

    // Prepare the message
    const msg = `
        *乂 Didula MD-V2 XVIDEO DOWNLOADER* 🔞

        • *𝖳𝗂𝗍𝗅𝗂𝖾* - ${xv_info.result.title}
        • *𝖵𝗂𝖾𝗐𝗌* - ${xv_info.result.views}
        • *𝖫𝗂𝗄𝖾* - ${xv_info.result.like}
        • *𝖣𝖾𝗌𝗅𝗂𝗄𝖾* - ${xv_info.result.deslike}
        • *𝖲𝗂𝗓𝖾* - ${xv_info.result.size}

         *©ᴩʀᴏᴊᴇᴄᴛꜱ ᴏꜰ ᴅɪᴅᴜʟᴀ ʀᴀꜱʜᴍɪᴋᴀ*`;

    // Sending the message with details
    const sentMsg = await conn.sendMessage(from, {
        text: msg,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: 'ᴩʀᴏᴊᴇᴄᴛꜱ ᴏꜰ ᴅɪᴅᴜʟᴀ ʀᴀꜱʜᴍɪᴋᴀ',
                newsletterJid: "120363343196447945@newsletter",
            },
            externalAdReply: {
                title: `Didula MD-V2 Xvideo Downloader`,
                body: `Can't Find The Information. You Can Try Another Way. Error Code 4043`,
                thumbnailUrl: xv_info.result.image,
                sourceUrl: ``,
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: mek });

    
await conn.sendMessage(from, { video: { url: xv_info.result.dl_link }, caption: xv_info.result.title }, { quoted: mek });

} catch (error) {
    console.error(error);
    reply('An error occurred while processing your request. Please try again later.');
}
});
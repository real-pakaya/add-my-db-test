const axios = require('axios');
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, downloadContentFromMessage, areJidsSameUser, getContentType } = require('@whiskeysockets/baileys')
const {cmd , commands} = require('../command')
const config = require("../config")

cmd({
    pattern: "pin",
    react: "😌",
    desc: "downlod images",
    category: "downlod",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
  if (!q) return reply(`Please give me song name ?`);
  async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent({
      image: {
        url
      }
    }, {
      upload: conn.waUploadToServer
    });
    return imageMessage;
  }
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  let push = [];
  let { data } = await axios.get(`https://allstars-apis.vercel.app/pinterest?search=${q}`);
  let res = data.data.map(v => v);
  shuffleArray(res); // Mengacak array
  let ult = res.splice(0, 10); // Mengambil 10 gambar pertama dari array yang sudah diacak
  let i = 1;
  for (let pus of ult) {
    push.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `Images - ${i++}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: config.FOOTER
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: 'Hello ' + pushname,
        hasMediaAttachment: true,
        imageMessage: await createImage(pus)
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
              {
                "name": "single_select",
                "buttonParamsJson": "{\"title\":\"title\",\"sections\":[{\"title\":\"title\",\"highlight_label\":\"label\",\"rows\":[{\"header\":\"header\",\"title\":\"title\",\"description\":\"description\",\"id\":\"id\"},{\"header\":\"header\",\"title\":\"title\",\"description\":\"description\",\"id\":\"id\"}]}]}"
              },
              {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"quick_reply\",\"id\":\"message\"}"
              },
              {
                 "name": "cta_url",
                 "buttonParamsJson": "{\"display_text\":\"url\",\"url\":\"https://www.google.com\",\"merchant_url\":\"https://www.google.com\"}"
              },
              {
                 "name": "cta_call",
                 "buttonParamsJson": "{\"display_text\":\"call\",\"id\":\"message\"}"
              },
              {
                 "name": "cta_copy",
                 "buttonParamsJson": "{\"display_text\":\"copy\",\"id\":\"123456789\",\"copy_code\":\"message\"}"
              },
              {
                 "name": "cta_reminder",
                 "buttonParamsJson": "{\"display_text\":\"cta_reminder\",\"id\":\"message\"}"
              },
              {
                 "name": "cta_cancel_reminder",
                 "buttonParamsJson": "{\"display_text\":\"cta_cancel_reminder\",\"id\":\"message\"}"
              },
              {
                 "name": "address_message",
                 "buttonParamsJson": "{\"display_text\":\"address_message\",\"id\":\"message\"}"
              },
              {
                 "name": "send_location",
                 "buttonParamsJson": ""
              }
           ]
      })
    });
  }
  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: 'Hellow how are you baby !'
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: config.FOOTER
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: [
              ...push
            ]
          })
        })
      }
    }
  }, {});
  await conn.relayMessage(m.chat, msg.message, {
    messageId: msg.key.id
  });
  
}catch(e){
console.log(e)
reply(`${e}`)
}
})
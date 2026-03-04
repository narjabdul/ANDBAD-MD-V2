const axios = require('axios');

module.exports = {
    name: 'pair',
    aliases: ['code', 'session', 'qrcode'],
    description: 'Get WhatsApp pairing code',
    run: async (context) => {
        const { client, m, text, prefix } = context;

        if (!text) {
            return await client.sendMessage(m.chat, {
                text: `Example Usage: ${prefix}pair 255782305254`
            }, { quoted: m });
        }

        try {
            // Send waiting message
            await client.sendMessage(m.chat, {
                text: `*𝐰𝐚𝐢𝐭 ✦𝗔𝗡𝗗𝗕𝗔𝗗-𝗠𝗗-𝗩2✦ 𝐢𝐬 𝐠𝐞𝐭𝐭𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐩𝐚𝐢𝐫 𝐜𝐨𝐝𝐞 ...*`
            }, { quoted: m });

            // Prepare the API request
            const number = text.replace(/[^0-9]/g, '');
            const encodedNumber = encodeURIComponent(number);
            const apiUrl = `https://andbad-pairb.onrender.com/code?number=${encodedNumber}`;

            // Fetch the pairing code from the API
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (data && data.code) {
                const pairingCode = data.code;
                
                // Send the pairing code
                await client.sendMessage(m.chat, {
                    text: pairingCode,
                    contextInfo: {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363422468773161@newsletter',
                            newsletterName: "✦𝗔𝗻𝗱𝗯𝗱𝗧𝗭✦ 𝗠𝗗-𝗩2",
                            serverMessageId: 143,
                        },
                    }
                }, { quoted: m });

                // Send instructions
                await client.sendMessage(m.chat, {
                    text: `𝗛𝗘𝗥𝗘 𝗜𝗦 𝗬𝗢𝗨𝗥 𝚙𝚊𝚒𝚛 𝚌𝚘𝚍𝚎, 𝗖𝗢𝗣𝗬 𝗔𝗡𝗗 𝗣𝗔𝗦𝗧 𝗜𝗧 𝗧𝗢 𝗧𝗛𝗘 𝐍𝐨𝐭𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝐧 𝗔𝗕𝗢𝗩𝗘 𝗢𝗥 𝗟𝗜𝗡𝗞 𝗗𝗘𝗩𝗜𝗖𝗘𝗦.`
                }, { quoted: m });
            } else {
                throw new Error("Invalid response from API.");
            }
        } catch (error) {
            console.error("Pair command error:", error);
            await client.sendMessage(m.chat, {
                text: `Error getting response from API.`
            }, { quoted: m });
        }
    }
};

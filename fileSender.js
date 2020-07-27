import stream from 'stream'

import discord, { MessageAttachment } from 'discord.js'

export default class FileSender {
    /**
     * send
     * @param {discord.Message} message message
     * @param {string} fileName fileName
     * @param {string|Buffer|any[]|stream.Readable} content content
     */
    static send(message, fileName, content = '') {
        if (typeof content === 'string') {
            try {
                content = JSON.parse(content);
            } catch {}
        }
        message.channel.send('', new MessageAttachment(typeof content === 'string' ? Buffer.from(content) : content, fileName)).catch(console.error);
    }
};

import fs from 'fs'

import discord, { Client } from 'discord.js'
import dotenv from 'dotenv'
import express from 'express'
import sqlite from 'sqlite-async'

import Command from './command.js'
import FileSender from './fileSender.js'
import Parser from './parser.js'

dotenv.config();

const app = express();
const listener = app.listen(process.env.PORT || 8080, () => console.log(`listening on port ${listener.address().port}`));

app.get('/', (req, res) => res.send('OK'));

/**
 * @type {Command[]}
 */
const commands = [];
fs.readdirSync('./commands').forEach(f => import(`./commands/${f}`).then(c => commands.push(new c.default)));

/**
 * Enum for stdout type
 * @readonly
 * @enum {number}
 */
const OutType = {
    NONE: 0,
    MESSAGE: 1,
    PIPE: 2,
    FILE: 3,
};

const client = new Client();

client.on('ready', async () => {
    console.log('bot ready');

    /*
     * reminder
     */
    setInterval(async () => {
        const db = await sqlite.open('./database/main.db').catch(console.error);
        const reminderList = await db.all('select * from remind where cast(date as integer) < ? and done < 1', [new Date().getTime()]).catch(console.error);

        if (reminderList && reminderList.length) {
            for (const reminder of reminderList) {
                client.channels.fetch(reminder.channel).then(channel => channel.send ? channel.send(`${reminder.mentions.replace(/,/g, ' ')}\n${reminder.message}`): null);
                await db.run('update remind set done = 1 where id = ?', reminder.id).catch(console.error);
            }
        }

        db.close();
    }, 60000);
});

// command
client.on('message', async message => {
    if (message.author.id === client.user.id) {
        return;
    }

    let stdin = '';
    let stdout = OutType.MESSAGE;
    const args = Parser.parse(message.content);

    for (let i = 0; i < args.length; i++) {
        const [argv, end, op] = Parser.parseSingle(args, i);
        i = end;

        switch (op.op) {
        case ';':
            stdout = OutType.MESSAGE;
            break;
        case '|':
            stdout = OutType.PIPE;
            break;
        case '>':
            stdout = OutType.FILE;
            break;
        case '&':
            stdout = OutType.NONE;
            break;
        }

        const instance = commands.find(c => c.name === argv[0] || c.alias.find(a => a === argv[0]));

        if (!instance) {
            break;
        }

        stdin = await instance.execute(message, argv, stdin);

        switch (stdout) {
        case OutType.MESSAGE:
            if (stdin) {
                message.channel.send(stdin.slice(0, 2000)).catch(console.error);
            }
            stdin = '';
            break;
        case OutType.PIPE:
            continue;
        case OutType.FILE:
            FileSender.send(message, args[++i], stdin);
            stdin = '';
            i++;
            break;
        case OutType.NONE:
        default:
            stdin = '';
            break;
        }
    }
});

client.login(process.env.TOKEN);

export {
    discord,
    client,
    sqlite,
    Command,
    Parser,
};

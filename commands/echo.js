import discord from 'discord.js'

import { Command } from '../index.js'

export default class EchoCommand extends Command {
    name = 'echo';
    synopsis = `echo [string]...`;
    examples = `echo foo`;
    description = 'echo the string(s) to standard output';
    /**
     * execute
     * @param {discord.Message} message message
     * @param {string[]} argv argv
     * @param {string} stdin stdin
     * @return {string} stdout
     */
    async execute(message, argv, stdin) {
        return argv.slice(1).join(' ') || stdin;
    }
}

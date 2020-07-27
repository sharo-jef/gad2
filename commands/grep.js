import discord from 'discord.js'

import { Command } from '../index.js'

export default class GrepCommand extends Command {
    name = 'grep';
    alias = [];
    synopsis = `grep <pattern>`;
    examples = `*echo foo | grep f*\nsearch f* from foo`;
    description = `grep  searches for <pattern> in stdin. grep prints the matching lines.`;
    /**
     * execute
     * @param {discord.Message} message message
     * @param {string[]} argv argv
     * @param {string} stdin stdin
     * @return {string} stdout
     */
    async execute(message, argv, stdin) {
        const result = stdin.toString().split(/\n/g).filter(l => new RegExp(argv[1] ? argv[1] : '', 'g').test(l));

        return result.join('\n').replace(new RegExp(`(${argv[1] ? argv[1] : ''})`, 'g'), '**$1**');
    }
};

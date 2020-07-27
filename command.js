import discord from 'discord.js'

export default class Command {
    /**
     * @type {string}
     */
    name = '';
    /**
     * @type {string[]}
     */
    alias = [];
    /**
     * @type {string}
     */
    synopsis = '';
    /**
     * @type {string}
     */
    examples = '';
    /**
     * @type {string}
     */
    description = '';
    /**
     * @type {string}
     */
    seeAlso = '';

    /**
     * execute
     * @virtual
     * @param {discord.Message} message message
     * @param {string[]} argv
     * @param {string} stdin stdin
     * @return {string} stdout
     */
    async execute(message = {}, argv = [], stdin = '') {
        return argv.slice(1).join(' ');
    }
}

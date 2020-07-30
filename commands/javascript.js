import { Command } from '../index.js'

export default class JavascriptCommand extends Command {
    name = 'javascript';
    alias = ['js', 'node'];
    synopsis = `javascript [code]`;
    examples = `*javascript '1 + 1'*\nexecute javascript`;
    description = `execute javascript (eval). print last expression.`;
    seeAlso = '[JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript)';
    /**
     * execute
     * @virtual
     * @param {discord.Message} message message
     * @param {string[]} argv
     * @param {string} stdin stdin
     * @return {string} stdout
     */
    async execute(message, argv, stdin) {
        const source = stdin.length > 0 ? stdin : argv.slice(1).join(' ');

        const result = `${(null, eval)(source)}`;

        return result;
    }
};

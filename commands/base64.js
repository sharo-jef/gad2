import { Command } from '../index.js'

export default class Base64Command extends Command {
    name = 'base64';
    alias = ['b64'];
    synopsis = `base64 [options]... [text]`;
    examples = `*base64 --decode YQ==*\nbase64 decode`;
    description = `base64 command

**OPTIONS**
*-e, --encode*
encode

*-d, --decode*
decode`;
    /**
     * execute
     * @param {discord.Message} message message
     * @param {string[]} argv argv
     * @param {string} stdin stdin
     * @return {string} stdout
     */
    async execute(message, argv, stdin) {
        let input = stdin;
        const options = {
            encode: true,
        };

        for (let i = 1; i < argv.length; i++) {
            switch (argv[i]) {
            case '--decode':
            case '-d':
                options.encode = false;
                break;
            case '--encode':
            case '-e':
                options.encode = true;
                break;
            default:
                input = argv[i];
            }
        }

        return options.encode ? Buffer.from(input).toString('base64') : Buffer.from(input, 'base64').toString();
    }
};

import moment from 'moment-timezone'

import { Command } from '../index.js'

export default class RemindCommand extends Command {
    name = 'remind';
    alias = [];
    synopsis = `remind [option]... <date> [mention]...`;
    examples = `*remind --channel #general --message 'REMIND' 2020/08/01 0:00*\nsetup reminder`;
    description = `remider command

options:
**-c, --channel**
set channel to push remind

**-m, --message**
set remind message

**-t, ---timezone**
set timezone [momentjs.com/timezone](https://momentjs.com/timezone/) (default: Asia/Tokyo)

date:
[momentjs.com/timezone](https://momentjs.com/timezone/)
`;
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
        const options = {
            timezone: 'Asia/Tokyo',
            message: '',
            channel: '',
        };

        let date = null;

        for (let i = 1; i < argv.length; i++) {
            switch (argv[i]) {
            case '-c':
            case '--channel':
                options.channel = argv[++i];
                break;
            case '-m':
            case '--message':
                options.message = argv[++i];
                break;
            case '-t':
            case '--timezone':
                options.timezone = argv[++i];
            default:
                date = moment.tz(argv[i++], options.timezone).unix() * 1000;
                console.log(date);
            }
        }

        const result = '';

        return result;
    }
};

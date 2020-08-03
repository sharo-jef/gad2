import moment from 'moment-timezone'

import { Command, discord, sqlite } from '../index.js'

export default class RemindCommand extends Command {
    name = 'remind';
    alias = [];
    synopsis = `remind [option]... <date> [mention]...`;
    examples = `*remind --channel #general --message 'REMIND' '2020-08-01T00:00:00'*\nsetup reminder`;
    description = `remider command

options:
**-c, --channel**
set channel to push remind

**-m, --message**
set remind message

**-t, --timezone**
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
            message: 'Reminder',
            channel: message.channel.id,
            mentions: [],
        };

        let date = null;

        for (let i = 1; i < argv.length; i++) {
            switch (argv[i]) {
            case '-c':
            case '--channel':
                options.channel = argv[++i].replace(/<|#|>/g, '');
                break;
            case '-m':
            case '--message':
                options.message = argv[++i];
                break;
            case '-t':
            case '--timezone':
                options.timezone = argv[++i];
                break;
            case '-d':
            case '--delete':
                const result = await this.delete(argv[++i].replace(/#/g, ''));
                return result ? `deleted reminder(#${argv[i].replace(/#/g, '')})` : 'failed';
            case '-l':
            case '--list':
                return await this.list();
            default:
                try {
                    if (!date) {
                        date = moment.tz(argv[i], options.timezone).unix() * 1000;
                    } else {
                        options.mentions.push(argv[i]);
                    }
                } catch {}
            }
        }

        if (!date) {
            console.error('invalid date');
            return 'Invalid Date';
        }

        const db = await sqlite.open(`${process.cwd()}/database/main.db`).catch(console.error);
        const {id} = await db.get('select max(id) as id from remind').catch(console.error);
        console.log([id + 1, `${options.channel}`, `${date}`, false, options.message]);
        await db.run('insert into remind values (?, ?, ?, ?, ?, ?)', [id + 1, `${options.channel}`, `${date}`, false, options.message, options.mentions.join(',')]).catch(console.error);
        await db.close();
        const result = `set reminder(#${id + 1}) at ${new Date(date)} to <#${options.channel}>`;

        return result;
    }

    async delete(id) {
        if (!id) {
            return false;
        }
        const db = await sqlite.open(`${process.cwd()}/database/main.db`).catch(console.error);
        const {done} = await db.get('select done from remind where id = ?', [+id]).catch(console.error);

        if (done) {
            return false;
        }

        await db.run('update remind set done = 1 where id = ?', [+id]).catch(console.error);
        await db.close();
        return true;
    }

    async list() {
        const db = await sqlite.open(`${process.cwd()}/database/main.db`).catch(console.error);
        const result = await db.all('select * from remind where done < 1').catch(console.error);
        await db.close();

        return result ? result.map(reminder => `#${reminder.id} <#${reminder.channel}> ${new Date(+reminder.date)} ${reminder.message}`).join('\n') : '';
    }
};

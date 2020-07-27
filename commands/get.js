import axios from 'axios'

import { Command } from '../index.js'

export default class GetCommand extends Command {
    name = 'get';
    alias = ['wget', 'curl'];
    synopsis = `get [OPTIONS]... <url>`;
    examples = `*get --type image 'https://img.youtube.com/vi/XlK6JfJcQT8/0.jpg' > a.jpg*\ndownload image to a.jpg`;
    description = `download command

**OPTIONS**
*-t, --type*
select file type from text, image, binary`;
    /**
     * execute
     * @param {discord.Message} message message
     * @param {string[]} argv argv
     * @param {string} stdin stdin
     * @return {string} stdout
     */
    async execute(message, argv, stdin) {
        let uri = stdin.length > 0 ? stdin : null;
        let responseType = 'text';

        if (uri === null) {
            for (let i = 0; i < argv.length; i++) {
                switch (argv[i]) {
                case '--type':
                case '-t':
                    i++;
                    responseType = argv[i];
                    break;
                default:
                    uri = argv[i];
                }
            }
        }

        const options = {
            responseType: 'arraybuffer',
        };

        const _result = await axios.get(uri, options);

        let result = '';

        switch (responseType) {
        case 'text':
            result = Buffer.from(_result.data, 'binary').toString();
            break;
        case 'image':
        case 'binary':
            result = _result.data;
            break;
        }

        return result;
    }
};

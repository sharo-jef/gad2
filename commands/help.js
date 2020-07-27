import fs from 'fs'

import discord from 'discord.js'

import { Command } from '../index.js'

export default class HelpCommand extends Command {
    name = 'help';
    synopsis = `help [command]`;
    examples = `*help help*\nshow help of help command`;
    description = `help command`;
    seeAlso = `type \`help\` to see list of all commands`;
    /**
     * execute
     * @param {discord.Message} message message
     * @param {string[]} argv argv
     * @param {string} stdin stdin
     * @return {string} stdout
     */
    async execute(message, argv, stdin) {
        await this.getCommandClasses();

        let cmd = stdin;

        for (let i = 1; i < argv.length; i++) {
            switch (argv[i]) {
            default:
                cmd = argv[i];
            }
        }

        let all = '';

        for (let clazz of this.commandClasses) {
            const iclazz = new clazz.default();
            if (cmd.length > 0 && iclazz.name === cmd) {
                const embed = {
                    embed: {
                        title: iclazz.name,
                        color: 0xff0000,
                        footer: {
                            text: "GAD"
                        },
                        author: {
                            name: "Help"
                        },
                        fields: [
                            {
                                name: "**SYNOPSIS**",
                                value: iclazz.synopsis
                            },
                            {
                                name: "**DESCRIPTION**",
                                value: iclazz.description
                            },
                            {
                                name: '**EXAMPLES**',
                                value: iclazz.examples
                            }
                        ]
                    }
                };

                if (iclazz.seeAlso && typeof iclazz.seeAlso === 'string' && iclazz.seeAlso.length > 0) {
                    embed.embed.fields.push({
                        name: '**SEE ALSO**',
                        value: iclazz.seeAlso
                    });
                }

                message.channel.send(embed);

                return '';
            }
            if (cmd.length === 0) {
                all += `> ${iclazz.name}\n`;
            }
        }

        return all.length > 0 ? all : 'command not found';
    }

    async getCommandClasses() {
        this.commandClasses = [];

        const files = fs.readdirSync('./commands/', {withFileTypes: true});

        for (let file of files) {
            if (file.isDirectory()) {
                return;
            }

            this.commandClasses.push(await import(`./${file.name}`));
        }
    }
};

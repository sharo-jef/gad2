import fs, { read } from 'fs'
import readline from 'readline'

import sqlite from 'sqlite-async'

if (!fs.existsSync('./patchstack')) {
    fs.mkdirSync('./patchstack');
    console.log('\u001b[32mcreated\u001b[0m patchstack');
}
if (!fs.existsSync('./logs.json')) {
    fs.writeFileSync('./logs.json', '{"added":[],"applied":[]}');
    console.log('\u001b[32mcreated\u001b[0m logs.json');
}
if (!fs.existsSync('./patch.sql')) {
    fs.writeFileSync('./patch.sql', '');
    console.log('\u001b[32mcreated\u001b[0m patch.sql');
}
if (!fs.existsSync('./main.db')) {
    fs.writeFileSync('./main.db', '');
    console.log('\u001b[32mcreated\u001b[0m main.db');
}

const patchstack = fs.readdirSync('./patchstack');

const logs = JSON.parse(fs.readFileSync('./logs.json', 'utf8'));

let added = logs.added;

added = [...added, ...patchstack.filter(p => !logs.applied.find(l => l === p))].filter((x, i, s) => s.indexOf(x) === i).sort();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', async line => {
    const args = line.split(/ /g);

    switch (args[0]) {
    case 'help':
        console.log(`help: show help
show: show added and applied
add: add patch.sql to patchstack and added list
apply: execute 'added' in logs.json and move to applied
delete <filename>: delete file from logs.json and patchstack (this is not rollback)
exit: exit interpreter`);
        break;
    case 'show':
        console.log(`\u001b[32mapplied\u001b[0m\n${logs.applied.join('\n')}\n\n\u001b[31madded\u001b[0m\n${added.join('\n')}`);
        break;
    case 'add':
        const fileName = `${new Date().getTime()}.sql`;
        fs.createReadStream('./patch.sql').pipe(fs.createWriteStream(`./patchstack/${fileName}`));
        added.push(fileName);
        console.log(`added ${fileName}`);
        break;
    case 'apply':
        const con = await sqlite.open('./main.db');
        for (let i = 0; i < added.length; i++) {
            await con.run(fs.readFileSync(`./patchstack/${added[i]}`, 'utf8')).catch(console.error);
            logs.applied.push(added[i]);
        }
        added = [];
        await con.close();
        console.log('applied');
        break;
    case 'delete':
        logs.applied = logs.applied.filter(l => l !== args[1]);
        added = added.filter(l => l !== args[1]);
        try {
            fs.unlinkSync(`./patchstack/${args[1]}`);
            console.log(`deleted ${args[1]}`);
        } catch {
            console.warn(`couldn't delete file ${args[1]}`);
        }
        break;
    case 'exit':
        rl.close();
    }

    logs.added = added.sort();
    logs.applied = logs.applied.sort();

    fs.writeFileSync('./logs.json', JSON.stringify(logs, null, 4));
    process.stdout.write('> ');
});

rl.once('close', () => process.exit());

process.stdout.write('> ');

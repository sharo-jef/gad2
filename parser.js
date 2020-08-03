import quote from 'shell-quote'

export default class Parser {
    static parse(line = '') {
        line = line.replace(/<#([^>]+)>/g, '[channel@$1]');
        line = line.replace(/<@!([^>]+)>/g, '[mention@$1]');
        line = line.replace(/<@&([^>]+)>/g, '[mention-$1]');
        let tmp = quote.parse(line);
        if (!tmp[tmp.length - 1].op) {
            tmp.push({op: ';'});
        }
        tmp = tmp.map(token => typeof token === 'string' ? token.replace(/\[channel@(.+)\]/g, '<#$1>') : token)
        tmp = tmp.map(token => typeof token === 'string' ? token.replace(/\[mention@(.+)\]/g, '<@!$1>') : token)
        tmp = tmp.map(token => typeof token === 'string' ? token.replace(/\[mention-(.+)\]/g, '<@&$1>') : token)
        console.log(tmp);
        return tmp;
    }

    static parseSingle(parsed = [{op: ';'}], start = 0) {
        let end = 1;

        for (let i = start; i < parsed.length; i++) {
            if (parsed[i].op) {
                end = i;
                break;
            }
        }

        return [parsed.slice(start, end), end, parsed[end]];
    }
}

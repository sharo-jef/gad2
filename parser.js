import quote from 'shell-quote'

export default class Parser {
    static parse(line = '') {
        const tmp = quote.parse(line);
        if (!tmp[tmp.length - 1].op) {
            tmp.push({op: ';'});
        }
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

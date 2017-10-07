import { Command, Parser } from './command-parser';

const constant = {
    aCommandRegExStr: '@(\w+)',
    labelCommandRegExStr: '\((\w+)\)'
};

let variableAddress = 16;
function assignVariableAddress() {
    return variableAddress++;
}

export class HhlParser extends Parser {
    constructor(...args) {
        super(...args);
        this.commandRouter = {
            '\(.*\)': token => new LabelCommand(token),
            '@(\w+)': token => new ACommand(token),
            '(\w+)=*([\w+\-!&|]*);*(\w*)': token => new CCommand(token)
        };
    }
}

export class LabelCommand extends Command {
    constructor({ token, line }) {
        this.line = line;
        [ _, this.tokenValue] = new RegExp(constant.labelCommandRegExStr).exec(token);
    }

    preprocess(context) {
        context[this.tokenValue] = (line + 1).toString(2);
        return this;
    }

    valid() {
        return false;
    }
}

export class ACommand extends Command {
    constructor({ token }) {
        [ _, this.tokeValue ] = new RegExp(constant.aCommandRegExStr, 'g').exec(token);
    }

    compile(context) {
        return context[tokeValue] || assignVariableAddress();
    }
}

export class CCommand extends Command {
    constructor({ token }) {
        this.token = token;
    }

    compile(context) {
        return context[this.token];
    }
}

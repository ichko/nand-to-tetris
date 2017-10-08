import { Command, Parser } from './command-parser';
import * as config from './config';

const constant = {
    aCommandRegExStr: '@(\\w+)',
    labelCommandRegExStr: '\\((\\w+)\\)',
    cCommandRegExStr: '(\\w+)=*([\\w+!&|-]*);*(\\w*)'
};

let variableAddress = 16;
function assignVariableAddress() {
    return variableAddress++;
}

export class HackParser extends Parser {
    constructor(...args) {
        super(...args);
        this.addRoutes({
            [constant.labelCommandRegExStr]: token => new LabelCommand(token),
            [constant.aCommandRegExStr]: token => new ACommand(token),
            [constant.cCommandRegExStr]: token => new CCommand(token)
        });
    }
}

export class LabelCommand extends Command {
    constructor({ token, line }) {
        super();
        this.line = line;
        this.tokenValue = new RegExp(constant.labelCommandRegExStr).exec(token)[1];
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
        super();
        this.tokenValue = new RegExp(constant.aCommandRegExStr, 'g').exec(token)[1];
    }

    preprocess(context) {
        if (new RegExp('[0-9]+', 'g').test(this.tokenValue)) {
            context[this.tokenValue] = this.tokenValue;
        }

        return this;
    }

    compile(context) {
        return context[this.tokenValue] || assignVariableAddress();
    }
}

export class CCommand extends Command {
    constructor({ token }) {
        super();
        let [ _, destination, command, jump ] = new RegExp(constant.cCommandRegExStr, 'g').exec(token);
        this.token = { destination, command, jump };
    }

    compile(context) {
        return '';
    }
}

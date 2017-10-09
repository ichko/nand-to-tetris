import { Pipe, Parser } from './command-parser';
import * as config from './config';


export class HackParser extends Parser {
    constructor(...args) {
        super(...args);
        this.addRoutes(
            new LabelPipe(),
            new APipe(),
            new CPipe()
        );
    }
}

export class LabelPipe extends Pipe {
    route() {
        return /\((\w+)\)/g;
    }

    preprocess({ token, line }) {
        this.line = line;
        this.tokenValue = this.route().exec(token)[1];
    }

    preprocess({ context }) {
        context[this.tokenValue] = (line + 1).toString(2);
        return this;
    }

    valid() {
        return false;
    }
}

export class APipe extends Pipe {
    constructor(...args) {
        super(...args);
        this.variableAddressGenerator = (id => _ => id++)(16);
    }

    route() {
        return /@(\w+)/g;
    }

    preprocess({ context, token }) {
        this.tokenValue = this.route().exec(token)[1];
        if (!isNaN(this.tokenValue)) {
            context[this.tokenValue] = +this.tokenValue;
        }

        return this;
    }

    compile(context) {
        return context[this.tokenValue] ||
            this.variableAddressGenerator();
    }
}

export class CPipe extends Pipe {
    route() {
        return /(\w+)=*([\w+!&|-]*);*(\w*)/g;
    }

    preprocess({ token }) {
        let [ _, destination, command, jump ] = this.route().exec(token);
        this.token = { destination, command, jump };
        return this;
    }

    compile(context) {
        return '?';
    }
}

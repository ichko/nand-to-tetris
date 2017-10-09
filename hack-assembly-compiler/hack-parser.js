import { Pipe, Parser } from './pipe-parser';
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
        return { key: this.route().exec(token)[1], value: (line + 1).toString(2) };
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

    preprocess({ token }) {
        let tokenValue = this.route().exec(token)[1];
        if (!isNaN(tokenValue)) {
            return { key: tokenValue, value: tokenValue };
        }
    }

    compile({ context, token }) {
        console.log(context);
        return context.hasOwnProperty(token) ?
            context[token] :
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
    }

    compile(context) {
        return '?';
    }
}

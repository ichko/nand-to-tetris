import { Pipe, Parser } from './pipe-parser';
import { commandMap, dstMap, jumpMap, variableCodes } from './config';


export class HackParser extends Parser {
    constructor(...args) {
        super(...args);
        this.addRoutes(
            new LabelPipe(),
            new APipe(),
            new CPipe(),
            new LoadDefaultsPipe()
        );
    }
}


function toBinary(number) {
    return parseInt(number).toString(2);
}

function padFront(string, size, char = '0') {
    const padSize = Math.max(size - string.length + 1, 0);
    return Array(padSize).join(char) + string;
}

class LoadDefaultsPipe extends Pipe {
    init(context) {
        for (let name in variableCodes) {
            context[name] = variableCodes[name];
        }
    }
}

class LabelPipe extends Pipe {
    init() {
        this.labelIndex = 0;
    }

    route() {
        return /\((.*)\)/g;
    }

    preprocess({ token, line }) {
        const [ _, tokenValue ] = this.route().exec(token);
        return {
            key: tokenValue,
            value: line - this.labelIndex++
        };
    }

    valid() {
        return false;
    }
}

class APipe extends Pipe {
    init() {
        this.instructionSize = 16;
        this.variableAddressGenerator = (id => context => id++)(16);
    }

    route() {
        return /@(.*)/g;
    }

    compile({ context, token }) {
        const [ _, tokenValue ] = this.route().exec(token);
        let evaluatedToken = context.hasOwnProperty(tokenValue) ?
            context[tokenValue] :
            isNaN(tokenValue) ?
                this.variableAddressGenerator(context) :
                tokenValue;
        context[tokenValue] = evaluatedToken;
        return padFront(toBinary(evaluatedToken), this.instructionSize);
    }
}

class CPipe extends Pipe {
    route() {
        return /((\w+)=)*([\w+!&|-]*);*(\w*)/g;
    }

    compile({ token }) {
        const [ _, __,
            destinationKey = '',
            computationKey = '',
            jumpKey = ''
        ] = this.route().exec(token);

        return '111' +
            commandMap[computationKey] +
            dstMap[destinationKey] +
            jumpMap[jumpKey];
    }
}

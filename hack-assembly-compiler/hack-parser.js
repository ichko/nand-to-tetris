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
    route() {
        return /\((\w+)\)/g;
    }

    preprocess({ token, line }) {
        const [ _, tokenValue ] = this.route().exec(token);
        return {
            key: tokenValue,
            value: line + 1
        };
    }

    valid() {
        return false;
    }
}

class APipe extends Pipe {
    constructor(...args) {
        super(...args);
        this.instructionSize = 16;
        this.variableAddressGenerator = (id => _ => id++)(16);
    }

    route() {
        return /@(\w+)/g;
    }

    compile({ context, token }) {
        const [ _, tokenValue ] = this.route().exec(token);
        return padFront(toBinary(
            isNaN(tokenValue) ? 
                context.hasOwnProperty(token) ?
                    context[token] :
                    this.variableAddressGenerator() :
            tokenValue
        ), this.instructionSize);
    }
}

class CPipe extends Pipe {
    route() {
        return /(\w+)=*([\w+!&|-]*);*(\w*)/g;
    }

    compile({ token }) {
        const [ _,
            destinationKey,
            computationKey,
            jumpKey
        ] = this.route().exec(token);
        
        return '111' +
            commandMap[computationKey] +
            dstMap[destinationKey] +
            jumpMap[jumpKey];
    }
}

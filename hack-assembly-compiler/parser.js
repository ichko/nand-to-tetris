const constant = {
    whitespaceRegex: new RegExp('[\s]+', 'g'),
    commentRegex: new RegExp('\/\/.+', 'g'),
    emptyWord: '',
    newLine: '\n'
}

class Command {
    constructor({ line }) {
        this.line = line;
    }

    valid() {
        return true;
    }

    preprocess() {
        return this;
    }

    build() {
        return `error at line ${ this.line }`;
    }
}

class LabelCommand extends Command {
    constructor({ token, line }) {
        this.line = line;
        this.token = token;
    }

    preprocess(context) {
        context[this.line + 1] = this.token;
        return this;
    }

    valid() {
        return false;
    }
}

class ACommand extends Command {
    constructor({ token }) {
        this.token = token;
    }
}

class CCommand extends Command{
    constructor({ token }) {
        this.token = token;
    }
}

export class Parser {
    constructor(srcCode = constant.emptyWord) {
        this.srcCode = srcCode;

        this.tokenize = src => src.split(constant.newLine);
        this.normalize = token => token
            .replace(constant.whitespaceRegex, constant.emptyWord)
            .replace(constant.commentRegex, constant.emptyWord);

        this.commandRouter = {
            '@\w+': token => new ACommand(token),
            '[\w+=]*.*[;\w*]*': token => new CCommand(token),
            '.*': token => new Command(token)
        };
    }

    makeCommand(input) {
        return new Object.keys(this.commandRouter)
            .map(route => new RegExp(route, 'g'))
            .find(routeRegex => routeRegex.test(token))(input);
    }

    parse() {
        let context = {};
        return this.tokenize(this.srcCode)
            .map(token => this.normalize(token))
            .filter(token => token !== constant.emptyWord)
            .map((token, line) => this.makeCommand({ token, line }))
            .map(command => command.preprocess(context))
            .filter(command => command.valid())
            .map(command => context[command.token])
            .join(constant.newLine);
    }
}

export const constant = {
    whitespaceRegex: new RegExp('[\s]+', 'g'),
    commentRegex: new RegExp('\/\/.+', 'g'),
    emptyWord: '',
    newLine: '\n'
}

export class Command {
    constructor({ token } = {}) {
        this.token = token;
    }

    valid() {
        return true;
    }

    preprocess() {
        return this;
    }

    compile(context) {
        return context[this.token];
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
            // '.*': token => new Command(token)
        };
    }

    addRoutes(routes) {
        Object.keys(routes).forEach(routeKey =>
            this.commandRouter[routeKey] = routes[routeKey]);
        return this;
    }

    makeCommand(input) {
        const commandIdentifier = Object.keys(this.commandRouter)
            .find(route => new RegExp(route, 'g').test(input.token));
        const constructor = this.commandRouter[commandIdentifier];

        return constructor && new constructor(input);
    }

    parse() {
        let context = {};
        return this.tokenize(this.srcCode)
            .map(token => this.normalize(token))
            .filter(token => token !== constant.emptyWord)
            .map((token, line) => this.makeCommand({ token, line }))
            .map(command => command.preprocess(context))
            .filter(command => command.valid())
            .map(command => command.compile(context))
            .join(constant.newLine);
    }
}

export const constant = {
    whitespaceRegex: new RegExp('[\s]+', 'g'),
    commentRegex: new RegExp('\/\/.+', 'g'),
    emptyWord: '',
    newLine: '\n'
}

export class Pipe {
    route() {
        return /$^/g;
    }

    valid() {
        return true;
    }

    preprocess({ token }) {
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

        this.parserPipes = [
            new Pipe()
        ];
    }

    addRoutes(...routes) {
        this.parserPipes.push(...routes);
        return this;
    }

    parse() {
        let context = {};
        return this.tokenize(this.srcCode)
            .map(token => this.normalize(token))
            .filter(token => token !== constant.emptyWord)
            .map(token => [token, this.parserPipes.find(pipe => pipe.route().test(token))])
            .map(([ token, pipe ], commandId) => pipe.preprocess({ token, context, commandId }))
            .filter(([ token, pipe ]) => pipe.vlid())
            .map(pipe => pipe.compile(context))
            .join(constant.newLine);
    }
}

export const constant = {
    whitespaceRegex: new RegExp('[\s\r]+', 'g'),
    commentRegex: new RegExp('\/\/.+', 'g'),
    emptyWord: '',
    newLine: '\n'
}

export class Pipe {
    init() {}

    route() {
        throw new Error('No valid pipe route found!');
    }

    valid() {
        return true;
    }

    preprocess() {}

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

    loadSrc(srcCode = constant.emptyWord) {
        this.srcCode = srcCode;
        return this;
    }

    addRoutes(...routes) {
        this.parserPipes = [...routes].concat(...this.parserPipes);
        return this;
    }

    parse() {
        let context = {};
        this.parserPipes.forEach(pipe => pipe.init(context));
        return this.tokenize(this.srcCode)
            .map(token => this.normalize(token))
            .filter(token => token !== constant.emptyWord)
            .map(token => {
                return {
                    token,
                    pipe: this.parserPipes.find(pipe => pipe.route().test(token))
                }
            })
            .map(({ token, pipe }, line) => {
                const { key, value } = pipe.preprocess({ token, line, context }) || {};
                if (key)
                    context[key] = value;

                return { pipe, token }
            })
            .filter(({ pipe }) => pipe.valid())
            .map(({ pipe, token }, line) => pipe.compile({ token, line, context }))
            .join(constant.newLine);
    }
}

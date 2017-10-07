import { Parser } from './parser';
import {
    LabelCommand,
    ACommand,
    CCommand
} from './command';


const srcCode = '';
const parser = new Parser(srcCode)
    .addRoutes({
        '\(.*\)': token => new LabelCommand(token),
        '@\w+': token => new ACommand(token),
        '[\w+=]*.*[;\w*]*': token => new CCommand(token)
    });

import { SymbolTable } from './symbol-table';


export class Parser {
    constructor() {
        this.srcCode = '';
    }

    load(srcCode = '') {
        this.srcCode = srcCode;
        return this;
    }

    parse() {
        
    }
}

export class SymbolTable {
    constructor() {
        this.table = {};
    }

    loadSymbol(symbolName, symbolValue) {
        this.table[symbolName] = symbolValue;
    }

    loadPredefinedSymbols() {

    }
}
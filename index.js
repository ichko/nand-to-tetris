import { HackParser } from './hack-assembly-compiler/hack-parser';
import fs from 'fs';


const inFile =  process.argv[2] || '';
const outFile = process.argv[3] || 'a.out';
const parser = new HackParser();

fs.readFile(inFile, 'utf8', (err, src) => {
    if (err) throw err;

    const machineCode = parser
        .loadSrc(src)
        .parse();

    fs.writeFile(outFile, machineCode);
});

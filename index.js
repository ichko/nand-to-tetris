import { HackParser } from './hack-assembly-compiler/hack-parser';


const srcCode = `
// Computes R0 = 2 + 3  (R0 refers to RAM[0])

@2
D=A
@3
D=D+A //cdsa
@0
M=D
`;

const parser = new HackParser(srcCode);
const machineCode = parser.parse();

console.log(machineCode);
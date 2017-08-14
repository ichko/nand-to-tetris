// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.

// Read input
@R0
D = M
@a
M = D

@R1
D = M
@b
M = D

@R2
M = 0
@res
M = 0

(MULT_LOOP)
    @i
    M = 1

    (LOOP)
        @i
        D = M
        @b
        D = D - M
        @RETURN
        D; JGT

        @i
        M = M + 1

        @a
        D = M
        @res
        M = M + D

        @LOOP
        0; JMP

(RETURN)
    @res
    D = M
    @R2
    M = D

(END)
    @END
    0; JMP

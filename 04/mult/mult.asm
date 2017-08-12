// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.

/*
    if a == 0 || b == b:
        R2 = 0
    else if: (a < 0 && b > 0) || (a > 0 && b < 0):
        @R0
        goto MULT
        R2 = -R0
    else:
        @R0
        goto MULT
    goto END

    MULT:
        a = M
        b = M + 1
        @M + 2
        res = 1
        i = 0
    MULT_LOOP:
        if i >= b: goto END
        i = i + 1
        res = res * a
        goto MULT_LOOP

    END:
    goto END
*/

@a
@b
@res

(MULT_RESULT)

(MULT_LOOP)
    @i
    M = 1

    (LOOP)
        @i
        D = M
        @b
        D = D - M
        @MULT_RESULT
        D; JGD

        @i
        M = M + 1

        @res
        D = M
        @a
        D = D + M

        @LOOP
        0; JMP


(END)
    @END
    0; JMP

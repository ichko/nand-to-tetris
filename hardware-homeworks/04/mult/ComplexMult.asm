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

// Check zeros
@a
D = M
@ZERO
D; JEQ

@b
D = M
@ZERO
D; JEQ


(SIGN_LOGIC_SPLIT)
    @b
    D = M
    @B_NEGATIVE
    D; JLT

(B_POSITIVE)
    @a
    D = M
    @B_POS_A_NEG
    D; JLT
    @B_POS_A_POS
    0; JMP

(B_NEGATIVE)
    @a
    D = M
    @B_NEG_A_NEG
    D; JLT
    @B_NEG_A_POS
    0; JMP


(B_POS_A_NEG)
    @a
    M = -M
    @DIFF_SIGN
    0; JMP

(B_NEG_A_POS)
    @b
    M = -M

(DIFF_SIGN)
    @DIFF_SIGN_RES
    D = M // Set the return address
    @MULT_LOOP
    0; JMP // Execute
    (DIFF_SIGN_RES)
        @res
        M = -M
        @RETURN
        0; JMP

(B_NEG_A_NEG)
    @a
    M = -M
    @b
    M = -M

(B_POS_A_POS)
    @EQ_SIGN_RES
    D = M // Set the return address
    @MULT_LOOP
    0; JMP // Execute
    (EQ_SIGN_RES)
        @RETURN
        0; JMP


(MULT_LOOP)
    @res_addr // Set D to the result address
    M = D
    @i
    M = 0

    (LOOP)
        @i
        D = M
        @b
        D = D - M
        @res_addr
        A = M
        D; JGT

        @i
        M = M + 1

        @res
        D = M
        @a
        D = D + M

        @LOOP
        0; JMP


(ZERO)
    @res
    M = 0

(RETURN)
    @res
    D = M
    @R2
    M = D

(END)
    @END
    0; JMP

// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

@SCREEN
D = A

@address
M = D // Base screen address
@8192
D = A
@addressCnt
M = D

(PROBE)
    @KBD
    D = M // Probe

    @BLACK
    D; JNE
    @WHITE
    0; JMP

(BLACK)
    D = -1
    @SET_SCREEN
    0; JMP

(WHITE)
    D = 0

(SET_SCREEN)
    @multiPixelVal
    M = D
    @i
    M = 1

    @address
    D = M
    @currentScreenPos
    M = D

    (LOOP)
        @addressCnt
        D = M
        @i
        D = D - M
        @PROBE
        D; JLT

        @i
        M = M + 1

        @multiPixelVal
        D = M
        @currentScreenPos
        A = M
        M = D

        @currentScreenPos
        M = M + 1

        @LOOP
        0; JMP
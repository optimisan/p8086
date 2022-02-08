.MODEL SMALL
.DATA
;// db a;
a DB ?
;// db b = 4520H;
b DB 4520H
.CODE 
.STARTUP
;// a = 10;
MOV a, 10
;// a+= b;
PUSH AX;store current AX temporarily
MOV AL, a; as a is 8-bit
ADD AL, b;add a+b
MOV a, AL;a = (a+b)
POP AX;restore previous value
;// while loop
WHILE1:
  CMP a, 4520H
  JZ W_END1
;some_statements will be here
JMP WHILE1
W_END1:
;rest of the program
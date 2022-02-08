// the 8086ALP preprocessor
db a;
dw b = 4520H;
a = 10;
a += b;
while(a!=4520H){
  some_statements
}
rest_of_program
.MODEL SMALL
.DATA
a DB ?
b DB 4520H
.CODE 
.STARTUP
;
MOV a, 10
PUSH AX
ADD a, b

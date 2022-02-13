---
icon: home-fill
---

# Welcome

`p8086` is the pre-processor for 8086. You can think of it as a new language which is similar to a lot of high level languages like C/C++/Java.

## What does it do?

Your code written in `p8086` will "compile" to standard 8086 instructions like `MOV` or `JMP`. You can then pass on this code to the assembler and see how it executes it calmly and precisely as you will hope.

## Installation and usage

You can use `p8086` online at [https://akshat-oke.github.io/p8086/src/](https://akshat-oke.github.io/p8086/src/)
Alternatively, you can install `p8086` as a CLI through npm.

```console
$ npm i --global p8086
```

To compile your code saved at `pc\folder\code.p86`, `cd` into the folder and run:

```console
pc\folder> p8086 code.p86
```

This will write the compiled code to `pc\folder\code.asm`.

> Don't use .asm as an extension for your source code file since it will be overwritten by the compiler.

## Example

Here is a quick example of a code in `p8086` to determine whether a number is even or odd.

```cpp # Odd or Even
/* A sample program in p8086
*/
db num = 24; //input
if(num%2 == 0){
  print "Even"; // very simple
} else {
  print "Odd";
}
end; // see 'Statements' for more info
```

This code will compile to the following 8086 Assembly Language:

```nasm # Compiled code
.MODEL SMALL
.STACK 200H
.DATA
num DW 24
str1 DB "Even$"
str2 DB "Odd$".CODE
;if (num%2 == 0)
;num%2 == 0
;num % 2
PUSH num
PUSH 2
POP BX
POP AX
PUSH DX
MOV DX, 0
DIV BX
MOV AX, DX
POP DX
PUSH AX
PUSH 0
POP AX
POP BX
CMP BX, AX
JNZ ifElse1
PUSH OFFSET str1
POP DX
MOV AH, 09
INT 21H
JMP ifElse1out
ifElse1:
PUSH OFFSET str2
POP DX
MOV AH, 09
INT 21H
ifElse1out:
.EXIT
END
```

Woah! That's _a lot_ of assembly for just `7` lines of `p8086`! This is because of...

## Unobtrusiveness

`p8086` is designed to be **unobtrusive** with any other statements in the code.

Every statement is thus independent of others.

In the above code, since the `print` statement needed to use registers `DX` and `AX`, it saves them to the stack and restores them afterwards.

Do tell me if there is a simpler way of doing this!

> Any valid 8086 instruction is also a valid `p8086` instruction!
> This means you can use `p8086` for just a small part of your original 8086 program, or vice versa!

## Let's go!

Ready to use `p8086`? Head on to learn the syntax from [the next page](constants.md) right away!

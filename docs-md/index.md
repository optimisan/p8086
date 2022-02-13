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
.STACK 500H
.DATA
num DB 24
strEven DB "Even$"
strOdd DB "Odd$"
.CODE
PUSH AX
DIV NUM
CMP AH, 00
JNZ IF1_else
  PUSH DX
  PUSH AX
  MOV DX, OFFSET strEven
  MOV AH, 09
  INT 21H
  POP AX
  POP DX
  JMP IF1_out
IF1_else:
  PUSH DX
  PUSH AX
  MOV DX, OFFSET strOdd
  MOV AH, 09
  INT 21H
  POP AX
  POP DX
IF1_out:
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

## Options

To use `p8086` simply head on to [the online compiler](https://akshat-oke.github.io/p8086/src) and start coding right away!
There are two options:

1. **Clean mode** This is to disable unobtrusiveness and prevent verbose `PUSH` and `POP` instructions .
2. **Disable Comments** By default comments will be added to the compiled assembly which marks the start of a statement being translated from `p8086`. You can remove these comments using this option.

## Let's go!

Ready to use `p8086`? Head on to learn the syntax from [the next page](overview.md) right away!

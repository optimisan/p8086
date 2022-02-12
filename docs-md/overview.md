---
icon: file-code
order: 999
---

# Overview

This page serves as a quick quide into `p8086`.

## Comments

Comments are the way you use in most languages:

1. Single line: `// comment`
2. Multi-line: `/*...*/`

## Data

### Variables

Available types are `db`, `dw`, `string`. You can use `var` or `int` to represent a word as well.

```clike
dw a;
db b = 43H;
var v = 5;
db ch = 'C';
int foo = 94;
string str = "Hello!";
```

### Constants

Constants are numbers, characters and string literals. These can only be used as `rvalues` in assignments.

## Expressions

### Assignment

You can assign values to variables using an arithmetic expression.

```clike
a = 2;
b = 2+5/6*7+(23-45); //messy, but works
```

### Conditions

These expressions can be used inside conditional statements like in `if` statements.

```clike
if(a == 0){
  //a is zero, yay!
}
while(34 <= b+a){
  //hmm...
}
```

## Statements

More information can be found on the [statements page](statements.md). `p8086` supports `if else`, `while` and `for` loops

More can be added here but enough for now. Head on to the next page to learn more!

## Examples

Sample programs written in `p8086` can be found in the [online compiler](https://akshat-oke.github.io/p8086/src).

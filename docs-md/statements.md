---
icon: code
order: 98
---

# Statements

All statements must end with a semi-colon. Variable declarations are also statements.

## 8086 instructions

All 8086 instructions are valid `p8086` statements, as long as they end with a semi-colon.

> This semi-colon will be stripped off while compiling

```js
// Just write normal stuff
MOV AX, AL;
CMP DX 5;
JZ go;
end;
go:
print "reached here";
end;
```

## Simple Statements

These include [assignments](variables.md#initialising-and-assigning) which were covered in the [Variables](variables.md) page.

Others are function calls and print statements.

### Postfix Statements

These are the postfix increment and decrement operators;

```cpp
var g = 6;
g++;//INC G
g--;//DEC G
```

### Print statement

`p8086` provides a simple construct to print to the screen easily.

```py
print expr;
```

Where `expr` means an expression.

> `print` is not exactly a function although you can write `print (expr)` as well, because `(expr)` is again an expression.

### End

The `end` statement is a shortcut to end the program.

```js p8086
end;
```

```nasm Compiled
.EXIT
END
```

## Compound Statements

### Conditional

The `if` statement body must be enclosed in `{}` braces.

```cpp
if (a == 23){
  print "23";
}

if(b!=23){
  print "not 23";
} else {
  print "b is something interesting";
}
```

### Loop

`p8086` supports the while loop.

```cpp
while (a != 0){
  print "let's go!";
  DEC A;
}
```

---
icon: diff
---

# Expressions

Expressions are divided into `lvalue` and `rvalue` expressions.

## LValue

These can occur on both sides of as assignment statement, or a conditional statement.
LValue means that it's value can be written to, which similar to the meaning of `lvalue references` in C++.

> In C++, it means that their memory cannot be reused; the variable can be used by the user again somewhere ahead.

```clike LValue examples
a //identifier
AX //registers (uppercase)
[123H] //immediate value
345 //invalid LValue; a number cannot be assigned a value
```

## RValue

RValues can only occur on the right side of as assignment, and both sides of a conditional expression.

> In C++, rvalue is an object whose resource _can be_ reused. They are like use-an-throw objects we can pass in function arguments "on-the-fly".
> `rvalue`s can never be on the left side of an assignment, because they are "read-only".
> An `lvalue` is always an `rvalue`
> !!!
> This is important for references in C++. A function like `void f(MyClass&& x)` declares x to be an rvalue, but inside the function it is an lvalue.
> Although `p8086` does not have functions, it is still true here.
> !!!

```clike RValue examples
1+4/6; //arithmetic expression
a+b/4; // types must match though
```

We can move onto listing the operations available.

## Arithmetic operators

Add, subtract, invert, multiply...

### Binary

Take two operands

| Operator | Function |
| -------- | -------- |
| +        | Add      |
| -        | Subtract |

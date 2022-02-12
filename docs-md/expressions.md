---
icon: diff
order: 799
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

!!! Just a terminology
RValue expressions are being called as 'constant' expressions here.
!!!

We can move onto listing the operations available.

## Arithmetic operators

Add, subtract, invert, multiply...

### Binary

Take two operands

| Operator | Function              |
| -------- | --------------------- |
| +        | Add                   |
| -        | Subtract              |
| %        | Mod, remainder        |
| /        | Signed multiplication |
| \*       | Signed division       |

!!! Note
LHS cannot be registers `AX` or `BX` because these operations use them.
Use one of the shortcut operators instead.
!!!

### Unary

Takes one operator
| Operator | Function |
| -------- | -------------------- |
| - | Negate the number|
| ! | Also Negates the number|

!!!
There is no `+` unary operator because I think it is pointless here.
To use logical not, use the `!` prefix expression instead.
!!!

## Prefix expressions

Like prefix and postfix operations in other languages, `p8086` only has prefix ones.

> _operator_ **lvalue**

| Operator | Function        |
| -------- | --------------- |
| ++       | Increment       |
| --       | Decrement       |
| !        | Invert the bits |

## Boolean Expressions

These are, sadly, different from [constant expressions](#rvalue), in the sense that they can be only used within conditional statements like `if` or `while`.

```clike Conditional
if(a==0){
  //statements
}
// this throws an error because the LHS is a constant expression
/*
  if((a+1) == 8){

  }
*/
```

> Support for AND, OR, NOT operators might be in future releases. But most likely not. Unless someone volunteers; I am sure someone will!

## Assignment expressions

> Syntax
> `lvalue operator rvalue`

| Operator | Function                |
| -------- | ----------------------- | --- |
| +=       | Add RHS to LHS          |
| -=       | Subtract                |
| \*=, /=  | You know them           |
| %=       | Equivalent to `l=l%r`   |
| \|=      | Equivalent to `l = l    | r`  |
| &=       | AND instead of OR above |

## Shortcut operators

Since the above operators will produce `PUSH` and `POP` instructions even for simple assignments like `a=4;`, you can the shortcut operators `:=` or `*:=` instead.

> This will `MOV` left, right

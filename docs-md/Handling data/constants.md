---
icon: container
order: 100
---

# Constants

## Constant literals

By these I mean numbers, characters and strings.

Numbers can be in decimal or `HEX`. To use a HEX number, append an `H` at the end (no spaces)

> Constants can never be `lvalue`s, but are always `rvalue`s.

```clike #
// Decimal
var a = 2;
var b = 234;
// HEX
db c = 56H;
dw g = 1234H;
// Following is an error:
// db overflow = 1234H
// CHARACTERS
db char = 'S'; // char DB 'S'
```

!!!
Constant literals are inserted in the `.DATA` segment. All `string` literals used "on-the-fly" (like in the [print statement](statements.md#print-statement)) also go in here.
!!!

## Registers

To represent 8086 registers like `AX`, `Bl` etc, use **uppercase** only.

## Constant Expressions

All expressions are constant by default.

> "By default" is misleading, since you can't change it.
> An expression can be a variable, constant literal or an arithmetic operation.

!!!
These cannot be used as left hand side expression of a boolean expression.
!!!

```js
var a = 1 + 3;
var b = a + b;
```

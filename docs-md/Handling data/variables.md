---
icon: database
order: 99
---

# Variables

## Types

The data types in `p8086` are actually the same as in 8086. _Type Name_ is what you write while declaring a variable. _8086 directive_ is what it will get translated to.

### Basic types

| Type Name | Description | 8086 directive |
| --------- | ----------- | -------------- |
| db        | Byte        | DB             |
| var, int  | Word        | DW             |
| dw        | Word        | DW             |
| dd        | Double word | DD             |

### Special types

These types aren't directly available otherwise.

| Type Name | Description           | 8086 directive |
| --------- | --------------------- | -------------- |
| String    | A string for printing | DB             |

### Example

```clike # Types
var a;
db b;
dw c;
string s = "Hello world!";
```

!!!
A `String` variable must also be initialized immediately.
!!!

## Initialising and assigning

This is exactly as you would do in any other language.

> _typeName_ identifier = _constant_

```clike # Initialising
var a = 1; // immediate
string s = "A string here";

a = 23H; // assign value
b = 45; // allowed, but the assembler won't be happy (b is not defined)
db c = 'c';
```

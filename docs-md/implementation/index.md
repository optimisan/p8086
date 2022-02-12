---
icon: typography
order: 1
---

# Implementation

This section lists how the `p8086` instructions get translated to 8086 assembly.

## List of Instructions

`p8086` converts your code into 8086 assembly code which uses these instructions.

### Data instructions

- `MOV` For shortcut instructions
- `DB/DW/DD` Directives, for declarations

### Branch instructions

- `JMP` Unconditional jump
- `JNZ, JZ, JAE, JA, JBE, JB` Conditional jumps
- `.END EXIT` The `end;` shortcut statement.
- `INT` Software interrupt for `print` statement

### Arithmetic instructions

- `ADD, SUB` Additive
- `IMUL, IDIV` Multiplicative. Signed by default.
- `NEG, NOT` Unary
- `INC, DEC` Prefix expressions

Support for `PROC` procedures and functions coming soon!

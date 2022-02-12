# Expressions

Ah, let's start with the most exciting part of all: **(evaluating) _expressions_!**

These include assignment expressions and arithmetic expressions/[constant expressions](../expressions.md#rvalue) (or `rvalue`s)

---

## Arithmetic

### The approach

Let's start with a very simple example.

```c
a = BX + AX;
```

How do you translate this? It's simple, right? Use the convenient `ADD` command and `MOV` back the result.
==- Click to reveal this solution

```nasm
ADD AX, BX
MOV a, AX
```

===
It looks pretty straightforward, but things get complicated when you add more operations.

> I am avoiding \* and / since they will unnecessarily complicate things here. They are similar though.

```c One more
a = AX + BX - CX;
```

Hmm. Where do we start? Let's pick a side: left get evaluated first (reason ahead). So this means we add `AX` and `BX` and then subtract `CX` from the result. Sweet. Let's try it out.
==- Click to reveal this solution

```nasm
ADD AX, BX
SUB CX, AX
MOV a, CX
```

===
Something is fishy here. We are implying that the result of a binary operation is stored in the left operator.

Now consider:

```c
AX = 1 + BX;
```

Where do we store the result? Right operator? What if the right side is also a number? We might assign another register like `AX` (it's called accumulator after all) but `AX` itself might be one of the other operators.

Trouble. Unless we know some memory element that is guaranteed not to be used in arithmetic operations directly. Well, we have a brilliant memory element...

### Stack

Stack is the answer to everything! Function calls, unobtrusiveness and expressions, all of them use the stack!

> Stack is _the_ magnificent data structure we all need. Registers and return addresses are all stored on the stack when a function call is made.

We store the result of an operation on the stack. Let's see that with a _blank_ operator:

```c
a // Note: a is word
  // stack operations require
  // require a word to be the operator
```

==- Click to reveal this solution

```nasm
PUSH a
```

===
Looks great. Just `PUSH` the result. What about assigning the value?

```c
a = 2;
```

==- Click to reveal this solution

```nasm
PUSH 2
POP a
```

===
Of course, just `POP` back the value into the `lvalue`! Let's tackle binary operators now.

```c
a = 1 + 2;
```

First, `PUSH` the operators. Then `ADD` them. Since stack contents cannot be manipulated directly, we have to store them somewhere. I have chosen the `AX` and `BX` registers.

This is how it will be implemented now:
==- Click to reveal this solution

```nasm
PUSH 1
PUSH 2
POP BX
POP AX
ADD AX, BX ;answer in AX
PUSH AX
POP a
```

===
Now everything is simpler, just `PUSH` and `POP` results and `POP` whatever remains into the `lvalue`. Let's try one last expression:

```c
s = 1+2 * (4 - 3);
```

Remember that parenthesis have greater priority.
==- Click to reveal this solution

```nasm
;s = 1+2 * (4 - 3)
PUSH AX
PUSH BX
;1 + 2 * (4 - 3)
PUSH 1
;2 * (4 - 3)
PUSH 2
;4 - 3
PUSH 4
PUSH 3
POP BX
POP AX
SUB AX, BX
PUSH AX
POP BX
POP AX
MUL BX
PUSH AX
POP BX
POP AX
ADD AX, BX
PUSH AX
POP s
POP BX
POP AX
```

===
This is all for expressions. I also `PUSH` and `POP` the `AX` and `BX` registers before evaluating so that their values are saved.

> Now you know the reason why LHS cannot be `AX` or `BX`. Suppose your LHS is `AX`, then after `POP AX`, we again `POP BX` and `POP AX` which will overwrite this already done result.

// import { DATA_DECLARATIONS } from "./app.js";
export const DATA_DECLARATIONS = [];
export const INSTRUCTIONS = []
const variables = {};
const errors = [];
// Enum Types
/**
 * @enum
 */
const Types = {
  number: "num",
  dw: "dw",
  db: "db",
  char: "db", //equivalent to a Byte
  string: "str",
}
Object.freeze(Types);
class Variable {
  /**
   * 
   * @param {string} type 
   * @param {string} value 
   */
  constructor(type, value) {
    this.type = type;
    this.name = value;
  }
  /**
   * 
   * @param {Value} value 
   */
  assign(value) {
    if (value.type == this.type) {
      this.value = value.value;
    } else {
      throw `Incompatible types (assigning '${value.type}' to ${this.type}`;
    }
  }
}
class Value {
  /**
   * @param  {string} type
   * @param  {number|string} value
   * @param  {string} instruction
   */
  constructor(type, value, instruction) {
    this.type = type;
    this.value = value;
    this.instruction = instruction;
  }
  /**
   * @override Object.toString()
   */
  toString() {
    return this.value;
  }
}
const typeMap = {
  db: "DB", var: "DB", dw: "DW", string: "DB"
}
const variableActions = {
  VariableStatement(typeName, varDeclaration) {
    // console.log(typeName.sourceString, varList.sourceString);
    // const c = varDeclaration.children;
    // console.log(c);
    const i = varDeclaration.eval();
    // console.log(typeName.sourceString, i.identifier, i.initialiser);
    const dataDeclare = `${i.identifier} ${typeMap[typeName.sourceString]} ${i.initialiser}`;
    DATA_DECLARATIONS.push(dataDeclare);
    variables[i.identifier] = new Variable(typeName.sourceString, i.initialiser);
  },
  Initialiser(_, val) {
    // console.log("initialiser = ", val.sourceString);
    return val.eval();
  },
  VariableDeclaration(identifier, init) {
    return { identifier: identifier.sourceString, initialiser: init.children.length == 0 ? "?" : init.eval().join("") };
  },
  AssignmentExpression(lValue, assignmentOperator, assignRight) {
    INSTRUCTIONS.push("PUSH AX", "PUSH BX");
    const lvalue = lValue.sourceString;
    console.log(assignRight)
    // Assign right will push a value on the stack
    const value = assignRight.eval();
    switch (assignmentOperator.sourceString) {
      case "=":
        INSTRUCTIONS.push(`POP ${lvalue}`);
        break;
      default:
        INSTRUCTIONS.push(`POP ${lvalue}`);
    }
    INSTRUCTIONS.push("POP BX", "POP AX");
    return value;
  },
  P_LValue(pL) {
    INSTRUCTIONS.push(`PUSH ${pL.sourceString}`);
    return new Value(Types.db, pL.sourceString, "");
  },
  AssignRight(e) {
    const val = e.eval();
    // INSTRUCTIONS
    return val;
  }
}
/** Enum for binary expressions operators */
const BinaryOperators = {
  add: "+", sub: "-", mul: "*", div: "/",
}
Object.freeze(BinaryOperators);
// Temporary variables are already defined in DATA_DECLARATIONS
// whose names are (two underscores prefix) "__TEMP1" and "__TEMP2" 
const expressionActions = {
  PrimaryExpression_paren(_, pExpr, __) {
    return pExpr.eval();
  },
  AdditiveExpression_add(a, _, b) {
    return getBinaryExprCompiled(a, b, BinaryOperators.add);
    // /** @type {Value}*/
    // const valueA = a.eval(); //PUSH a
    // /** @type {Value} */
    // const valueB = b.eval(); //PUSH b
    // if (valueA.type != valueB.type) {
    //   throwError("Incompatible types");
    // }

    // const compiled = [
    //   // ...valueA,
    //   "POP AX",
    //   "POP BX",
    //   "ADD AX, BX",
    //   "PUSH AX"
    // ];
    // INSTRUCTIONS.push(compiled);
    // return valueA.type;
  },
  AdditiveExpression_sub(a, _, b) {
    return getBinaryExprCompiled(a, b, BinaryOperators.sub);
  },
  MultiplicativeExpression_mul(a, _, b) {
    return getBinaryExprCompiled(a, b, BinaryOperators.mul);
  },
  MultiplicativeExpression_div(a, _, b) {
    return getBinaryExprCompiled(a, b, BinaryOperators.div);
  },
  UnaryExpression_unaryPlus(_, u) {
    return getUnaryExprCompiled(u, BinaryOperators.add);
  },
  UnaryExpression_unaryMinus(_, u) {
    return getUnaryExprCompiled(u, BinaryOperators.sub);
  },
  UnaryExpression_logicNot(_, u) {
    return getUnaryExprCompiled(u, BinaryOperators.sub);
  },
}
function getUnaryExprCompiled(e, operator) {
  const value = e.eval();
  const compiled = [];
  switch (operator) {
    case BinaryOperators.add:
      break;
    case BinaryOperators.sub:
    case "!":
      compiled.push("POP AX", "NEG AX", "PUSH AX");
      break;
    default:
      break;
  }
  INSTRUCTIONS.push(compiled);
  return value;
}
function getBinaryExprCompiled(a, b, operator) {
  /** @type {Value}*/
  const valueA = a.eval(); //PUSH a
  /** @type {Value} */
  const valueB = b.eval(); //PUSH b
  /* Stack is:
        | - |
        | a |
        | b | <- SP
        |   | 
    */
  if (valueA.type != valueB.type) {
    throwError("Incompatible types");
  }
  const compiled = [
    "POP BX",
    "POP AX",
  ]
  switch (operator) {
    case BinaryOperators.add:
      compiled.push("ADD AX, BX");
      break;
    case BinaryOperators.sub:
      compiled.push("SUB AX, BX");
      break;
    case BinaryOperators.div:
      compiled.push(
        "PUSH DX",
        "MOV DX, 0",
        "DIV BX",
        "POP DX",
      );
      break;
    case BinaryOperators.mul:
      throwError("Multiplication not supported yet");
      break;
    default:
      throwError("Unexpected operator!");
      break;
  }
  compiled.push("PUSH AX");
  INSTRUCTIONS.push(compiled);
  return valueA;
}

const constantActions = {
  immediateValue(i) {
    return i.eval();
  },
  characterLiteral(_, c, __) {
    INSTRUCTIONS.push("PUSH " + this.sourceString);
    return new Value(Types.char, this.sourceString, getExprInstr(this));
  },
  numberLiteral(n) {
    INSTRUCTIONS.push("PUSH " + this.sourceString);
    return new Value(Types.number, this.sourceString, getExprInstr(this));
  },
  stringLiteral(_, s, __) {
    const str = `"${s.sourceString}$"`;
    return new Value(Types.string, str, getExprInstr(str));
  },
  LValue(l) {
    return new Value(Types.db, l.sourceString, "");
  },
  register(r) {
    return new Value(Types.db, r.sourceString, "");
  },
}
export const actions = {
  _iter(...children) {
    return children.map((c) => c.eval());
  },
  ...constantActions,
  MasmOperation(m, _) {
    INSTRUCTIONS.push(m.sourceString);
    // m.eval();
  },
  // directive()
  MasmLabel(m, _) {
    INSTRUCTIONS.push(m.sourceString + ":");
  },
  Statement(s, _) {
    s.eval();
  },
  EndStatement(_) {
    INSTRUCTIONS.push(".EXIT", "END");
  },
  ...variableActions,
  ...expressionActions
}
/**
 * Throw an error
 * @param {string} e Error message
 */
function throwError(e) {
  errors.push(e);
}
/**
 * @param {Object|string} node 
 * @returns The PUSH instruction for this node
 */
function getExprInstr(node) {
  return `PUSH ${node.sourceString ?? node}`;
}
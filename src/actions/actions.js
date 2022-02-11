// import { DATA_DECLARATIONS } from "./app.js";
export const DATA_DECLARATIONS = [];
export const INSTRUCTIONS = []
export const errors = [];
export const warnings = [];
const variables = {};
let simpleMode = false;
/** Number of if statements
 *  @type {number} */
export let ifNum = 0;
export function ifNumInc() {
  ++ifNum;
}
/** Number of iterative statements
 *  @type {number} */
export let iterNum = 0;
export function iterNumInc() {
  ++iterNum;
}
import { blockActions } from "./block_actions.js";
export function resetProg() {
  DATA_DECLARATIONS.length =
    INSTRUCTIONS.length =
    errors.length =
    warnings.length =
    ifNum = iterNum = 0;
}
// Enum Types
const Types = {
  all: "ALL",
  ea: "EFFECTIVE_ADDRESS",
  reg: "REG",
  number: "DW",
  dw: "DW",
  db: "DB",
  char: "DB", //equivalent to a Byte
  string: "STRING",
}
Object.freeze(Types);
class Variable {
  /**
   * 
   * @param {Types} type Type of this variable
   * @param {string} value Name of identifier
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
    console.log("Found var", Types[typeName.sourceString]);
    variables[i.identifier] = new Variable(Types[typeName.sourceString], i.initialiser);
  },
  Initialiser(_, val) {
    // console.log("initialiser = ", val.sourceString);
    return val.eval();
  },
  VariableDeclaration(identifier, init) {
    return { identifier: identifier.sourceString, initialiser: init.children.length == 0 ? "?" : init.eval().join("") };
  },
  AssignmentExpression(lValue, assignmentOperator, assignRight) {
    useRegisters("AX", "BX");
    // INSTRUCTIONS.push("PUSH AX", "PUSH BX");
    const lvalue = lValue.eval();
    const lvStr = lvalue.value;
    const operator = assignmentOperator.sourceString;
    console.log(assignmentOperator);
    // Assign right will push a value on the stack
    let value = assignRight.eval();
    console.log("lv", lvalue);
    // AX and BX are not allowed
    if (lvalue.value.toUpperCase() == "AX" | lvalue.value.toUpperCase() == "BX") {
      throwError(`[At '${lvStr + operator}']: LValue '${lvStr}' cannot be used because it will be overwritten by the RHS expression. Use the MOVE operator §4.2 ':=' instead.`)
      return;
    }
    const castToDW = checkTypes(operator, lvalue, value);
    if (castToDW) {
      value = castVarTo(value, castToDW);
    }
    // console.log("rvalue", value);
    switch (operator) {
      case "=":
        INSTRUCTIONS.push(`POP ${lvalue}`);
        break;
      default:
        INSTRUCTIONS.push(`POP ${lvalue}`);
    }
    // INSTRUCTIONS.push("POP BX", "POP AX");
    restoreRegisters("BX", "AX");
    return value;
  },
  P_LValue(pL) {
    INSTRUCTIONS.push(`PUSH ${pL.sourceString}`);
    return new Value(checkVar(pL.sourceString).type, pL.sourceString, "");
  },
  AssignRight(e) {
    const val = e.eval();
    // INSTRUCTIONS
    return val;
  },
  MovShortcut(lv, _, rv) {
    const lvalue = lv.eval();
    let rvalue = rv.eval();
    console.log("lv", lvalue)
    if (lvalue.type == Types.ea && rvalue.type == Types.ea) {
      throwError(`At '${this.sourceString}': Both values are memory addresses.`)
    }
    const c = checkTypes(this.sourceString, lvalue, rvalue, true);
    if (c) {
      rvalue = castVarTo(rvalue, c);
    }
    INSTRUCTIONS.push(`MOV ${lv.sourceString}, ${rvalue.value}`);
  },
  PrefixExpression(operator, lvalue) {
    const value = lvalue.eval();
    console.log(value);
    if (value.type == Types.ea) {
      throwError(`[At '${this.sourceString}'] ${lvalue.sourceString} is not a valid lvalue`);
      return;
    }
    let command = operator.sourceString == "++" ? "INC" : "DEC";
    INSTRUCTIONS.push(command + " " + lvalue.sourceString);
  }
}
/** Enum for binary expressions operators */
const BinaryOperators = {
  add: "+", sub: "-", mul: "*", div: "/", mod: "%",
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
  MultiplicativeExpression_mod(a, _, b) {
    return getBinaryExprCompiled(a, b, BinaryOperators.mod);
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
    // case BinaryOperators.sub:
    case "!":
      compiled.push("POP AX", "NEG AX", "PUSH AX");
      break;
    default:
      break;
  }
  INSTRUCTIONS.push(...compiled);
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
  if (valueA.type != Types.dw && valueA.type != Types.all && valueA.type != Types.ea) {
    // throwError("Incompatible types");
    throwError(`At '${valueA.value + operator}'] LValue ${valueA.value} is 8-bit and cannot be used.`);
  }
  const compiled = [
    `; ${operator}`,
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
      //throwError("Multiplication not supported yet");

      compiled.push(
        "MUL BX",
        // "MOV AX"
      );
      break;
    case BinaryOperators.mod:
      compiled.push(
        "PUSH DX",
        "MOV DX, 0",
        "DIV BX",
        "MOV AX, DX",
        "POP DX",
      );
      break;
    default:
      throwError("Unexpected operator!");
      break;
  }
  compiled.push("PUSH AX");
  INSTRUCTIONS.push(...compiled);
  return valueA;
}

const constantActions = {
  immediateValue(i) {
    return i.eval();
  },
  MemoryAddress(_, ea, __) {
    const value = ea.eval();
    return { ...value, type: Types.ea };
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
  pStringLiteral(_, s, __) {
    DATA_DECLARATIONS.push(`${s.sourceString} DB "${s.sourceString}$"`);
  },
  LValue(l) {
    // console.log(l.sourceString);
    return l.eval();
  },
  identifier(i) {
    const variable = checkVar(i.sourceString);
    return new Value(variable.type, i.sourceString, "PUSH ;identi");
  },
  register(r) {
    let type = Types.db;
    console.log("r", r);
    if (r.sourceString?.includes("X")) type = Types.dw;
    return new Value(type, r.sourceString, "");
  },
}
export const actions = {
  _iter(...children) {
    return children.map((c) => c.eval());
  },
  _terminal() {
    return this;
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
  SCStatement(s, _) {
    s.eval();
  },
  EndStatement(_) {
    INSTRUCTIONS.push(".EXIT", "END");
  },
  ...variableActions,
  ...expressionActions,
  ...blockActions,
}
/**
 * Throw an error
 * @param {string} e Error message
 */
export function throwError(e) {
  errors.push(e);
}
export function warn(e) {
  warnings.push(e);
}
/**
 * This will `PUSH` the registers
 * **The order matters!**
 * @param  {...string} registers Registers which should be saved
 */
export function useRegisters(...registers) {
  registers.forEach(r => INSTRUCTIONS.push(`PUSH ${r}`))
}
/**
 * This will `POP` the registers
 * **The order matters!**
 * @param  {...string} registers Registers which should be restored
 */
export function restoreRegisters(...registers) {
  registers.forEach(r => INSTRUCTIONS.push(`POP ${r}`))
}

/**
 * @param {Object|string} node 
 * @returns The PUSH instruction for this node
 */
function getExprInstr(node) {
  return `PUSH ${node.sourceString ?? node}`;
}
/**
 * Checks types and determines if they can be casted
 * @param {String} m Message to display if types are incompatible
 * @param {Value} lv lvalue
 * @param {Value} rv rvalue
 * @returns To which type rvalue should be casted to
 */
function checkTypes(m, lv, rv, strict) {
  // console.log("checking", lv, rv);
  if (strict && (registerRegex.test(lv.value) || registerRegex.test(rv.value))) {
    lv.type = "REG_" + lv.type;
    rv.type = "REG_" + rv.type;
  }
  if (lv.type != rv.type) {
    if (lv.type == Types.dw || rv.type == Types.db) {
      return Types.dw;
    }
    if (lv.type == Types.all || rv.type == Types.all) {
      return Types.all;
    }
    // throwError(`Incompatible types at '${m}' (${lv.type} and ${rv.type}): Unable to cast ${rv.type} to ${lv.type}`);
    warn(`Incompatible types at '${m}' (${lv.type} and ${rv.type}): Unable to cast ${rv.type} to ${lv.type}`);
  }
}
function checkVar(name) {
  // console.log("Searching " + name, variables[name]);
  if (!variables[name]) {
    console.info("[Warning] " + name + " not defined");
    warn("'" + name + "' not defined");
    return { value: null, name, type: /ax|bx/ig.test(name) ? Types.reg : Types.all }
  }
  return variables[name];
}
/**
 * Casts variable to type
 * @param {Value} variable 
 * @param {string} typeToCastTo 
 * @returns Casted variable
 */
function castVarTo(variable, typeToCastTo) {
  if (decimalRegex.test(variable.value)) {
    return variable;
  } else if (hexRegex.test(variable.value)) {
    if (typeToCastTo == Types.dw) {
      return { ...variable, type: typeToCastTo, value: variable.value.padStart(5, "0") }
    }
  }
  return variable;
}
/**
 * Adds a comment to the compiled instructions
 * if the option is enabled.
 * ";" is added at the start as well.
 * @param {string} c Comment to add
 */
export function addComment(c) {
  //if comments_on
  INSTRUCTIONS.push(";" + c);
}
const decimalRegex = /[0-9]+/ig;
const hexRegex = /[A-F0-9]+H/ig;
const registerRegex = /ax|bx|cx|dx|al|bl|Cl|Dl|ah|bh|ch|dh|si|di|/g;

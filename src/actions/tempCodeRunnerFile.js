import { INSTRUCTIONS, restoreRegisters, throwError, useRegisters } from "./actions.js";
/** Maps each operator to a JUMP mnemonic
 * This checks for the inverted condition,
 * so that it will skip the true condition block.
 * @type {enum}
*/
const JMPmapNeg = {
  "==": "JNZ", //means continue if equal, but jump if not equal
  "===": "JNZ",
  "!=": "JZ",
  "!==": "JZ",
  "<": "JAE",
  "<=": "JA",
  ">": "JBE",
  ">=": "JB",
}
/** Number of if statements
 *  @type {number} */
let ifNum = 0;
export const blockActions = {
  BlockStatement(b, s) {
    b.eval();
    // console.log(b, s);
  },
  IfStatement(_, condExpr, block, __, elseBlock) {
    const label = `ifElse${ifNum}`;
    const { jumpCommand } = condExpr.eval();
    INSTRUCTIONS.push(`${jumpCommand} ${label}`);
    block.eval();
    console.log("elseBLock", elseBlock);
    INSTRUCTIONS.push(`JMP ${label}out`, `${label}:`);
    elseBlock.eval();
    INSTRUCTIONS.push(`${label}out:`);
    // console.log(condExpr);
    // console.log(block);
    ++ifNum;
  },
  ConditionExpr_paren(_, c, __) {
    return c.eval();
  },
  ConditionalExpression(lv, operator, rv) {
    useRegisters("AX");
    const lvalue = lv.sourceString;
    const rvalue = rv.eval();
    const jmpCmd = JMPmapNeg[operator];
    INSTRUCTIONS.push(
      "POP AX",
      `CMP ${lvalue}`
    );
    if (!jmpCmd) {
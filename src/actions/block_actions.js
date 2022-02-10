import { INSTRUCTIONS, restoreRegisters, throwError, useRegisters, ifNum, ifNumInc } from "./actions.js";
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
export const blockActions = {
  BlockStatement(b, s) {
    b.eval();
    // console.log(b, s);
  },
  Block_block(_, program, __) {
    program.eval();
  },
  IfStatement(_, condExpr, block, __, elseBlock) {
    ifNumInc();
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
  },
  ConditionExpr_paren(_, c, __) {
    return c.eval();
  },
  ConditionalExpression(lv, operator, rv) {
    // useRegisters("AX");
    const lvalue = lv.sourceString;
    const rvalue = rv.eval();
    const jmpCmd = JMPmapNeg[operator.sourceString];
    INSTRUCTIONS.push(
      "POP AX",
      `CMP ${lvalue}, AX`
    );
    if (!jmpCmd) {
      throwError("Unexpected operator");
    }
    // restoreRegisters("AX");
    return { lvalue, operator, jumpCommand: jmpCmd };
  }
  // EmptyStatement(_){},

}
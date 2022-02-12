import { INSTRUCTIONS, restoreRegisters, throwError, useRegisters, ifNum, ifNumInc, iterNum, iterNumInc, addComment } from "./actions.js";
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
const iterativeActions = {
  WhileStatement(_, condExpr, block) {
    iterNumInc();
    const label = `while${iterNum}`;
    INSTRUCTIONS.push(label + ":"); // while0: ;start loop
    const jumpCommand = condExpr.eval(); // CMP ;condition 
    INSTRUCTIONS.push(`${jumpCommand} ${label}exit`); // JZ while0out
    block.eval(); // inside statements
    INSTRUCTIONS.push(
      `JMP ${label}`,// JMP while0 ;go back above
      `${label}exit:`,
    );
  },
  ForStatement(foR, _,
    forStatExp, __, condExpr, ___,
    forStatExp2, ____, block,) {
    iterNumInc();
    addComment("for loop");
    const label = `for${iterNum}`;
    const exitLabel = `for${iterNum}exit`;
    forStatExp.eval();
    INSTRUCTIONS.push(label + ":");
    const cond = condExpr.eval();
    console.log("cond", JSON.stringify(cond));
    // if (!jumpCommand) jumpCommand = "JMP";
    // if (jumpCommand)
    INSTRUCTIONS.push(`${cond} ${exitLabel}`);
    addComment("for body");
    block.eval();
    addComment("for 'inc'");
    forStatExp2.eval();
    INSTRUCTIONS.push(
      `JMP ${label}`,
      `${exitLabel}:`
    );
    addComment("for end");
  },
  // ForStatExpr(f, _) {
  //   f.eval();
  // }
}
export const blockActions = {
  BlockStatement(b, s) {
    b.eval();
    // console.log(b, s);
  },
  PrintStatement(_, __, pe) {
    pe.eval();
  },
  PrintExpression_paren(_, p, __) { p.eval() },
  PrintExpression(p) {
    p.eval();
    INSTRUCTIONS.push(
      "POP DX",
      "MOV AH, 09",
      "INT 21H",
    );
  },

  Block_block(_, program, __) {
    program.eval();
  },
  IfStatement(_, condExpr, block, __, elseBlock) {
    addComment(`if ${condExpr.sourceString}`);
    ifNumInc();
    const label = `ifElse${ifNum}`;
    const jumpCommand = condExpr.eval();
    INSTRUCTIONS.push(`${jumpCommand} ${label}`);
    block.eval();
    // console.log("elseBLock", elseBlock);
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
    addComment(this.sourceString);
    // console.log(operator);
    useRegisters("AX", "BX");
    const lvalue = lv.eval();//sourceString;
    const rvalue = rv.eval();
    const jmpCmd = JMPmapNeg[operator.sourceString];
    console.log(jmpCmd);
    INSTRUCTIONS.push(
      "POP AX", //rvalue here
      "POP BX", //lvalue here
      `CMP BX, AX`
    );
    if (!jmpCmd) {
      throwError("Unexpected operator");
    }
    restoreRegisters("AX", "BX");
    return jmpCmd;
    // return { lvalue, operator, jumpCommand: jmpCmd };
  },
  // EmptyStatement(_){},
  ...iterativeActions,
}
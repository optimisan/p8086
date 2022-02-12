import { INSTRUCTIONS, throwError, Types } from "./actions.js";

/**
 * 
 * @param {Value} lv 
 * @param {Value} rv
 * @param {string} operator 
 */
export function stringShortCut(lv, rv, operator) {
  // we already have values of lv and rv on the stack
  /*| -- |
    | lv |
    | rv |
  */
  if (rv.type != Types.string) return false;
  if (lv.type == Types.ea || lv.type == Types.number || lv.type == Types.reg) {
    throwError(`[At '${lv.value}${operator}'] Cannot copy to type ${lv.type}`)
  }
  // INSTRUCTIONS.pop(); //remove rv from instructions (and stack)
  INSTRUCTIONS.push(
    "MOV AX, DS",
    "MOV ES, AX",
    "POP AX", // rv
    "LEA DX, AX",

  )
}
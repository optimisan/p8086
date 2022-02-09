import { grammar } from "./grammar.js";
import { actions, DATA_DECLARATIONS, INSTRUCTIONS } from "./actions.js";
// export const DATA_DECLARATIONS = [];
// export const INSTRUCTIONS = [];
const outputDiv = document.getElementById("output");
const codeText = document.getElementById("code");
const p8086 = ohm.grammar(grammar);
const s = p8086.createSemantics();
s.addOperation("eval", actions);
function compile() {
  DATA_DECLARATIONS.length = 0;
  outputDiv.innerHTML = "";
  const matchResult = p8086.match(codeText.value);
  if (matchResult.succeeded()) {
    try { s(matchResult).eval(); } catch (e) {
      console.error("[Compiling error]", e);
    }
    outputDiv.innerHTML += "<br>.DATA<br>"
    outputDiv.innerHTML += DATA_DECLARATIONS.join("<br>");
    outputDiv.innerHTML += "<br>.CODE<br>"
    outputDiv.innerHTML += INSTRUCTIONS.join("<br>");
  } else {
    outputDiv.innerHTML = matchResult.message;
    console.error(matchResult.message);
  }
}
document.getElementById("compile").addEventListener("click", e => {
  compile();
})
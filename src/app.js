import { grammar } from "./grammar.js";
import { actions, DATA_DECLARATIONS, INSTRUCTIONS, errors } from "./actions.js";
import { CodeJar } from "https://medv.io/codejar/codejar.js";
const editor = document.querySelector("#editor");
let jar = CodeJar(editor, (e) => {
  // e.innerHTML = theCodeHTML;
});
jar.updateCode(`dw a;
a = 2+4-(3);
a = -2;
MOV DX, a;
end;`)
let code = jar.toString();
editor.addEventListener("keyup", () => {
  code = jar.toString();
  document.querySelector("pre#hidden code").innerHTML = code;
})
// export const DATA_DECLARATIONS = [];
// export const INSTRUCTIONS = [];
const outputDiv = document.getElementById("output");
const codeText = document.getElementById("code");
const p8086 = ohm.grammar(grammar);
const s = p8086.createSemantics();
s.addOperation("eval", actions);
function compile() {
  DATA_DECLARATIONS.length = 0;
  INSTRUCTIONS.length = 0;
  errors.length = 0;
  outputDiv.innerHTML = "";
  const matchResult = p8086.match(jar.toString());
  if (matchResult.succeeded()) {
    try { s(matchResult).eval(); } catch (e) {
      console.error("[Compiling error]", e);
    }
    if (errors.length != 0) {
      outputDiv.innerHTML = errors.join("<br>");
      return;
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
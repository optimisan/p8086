import { grammar } from "./grammar.js";
import { actions, DATA_DECLARATIONS, INSTRUCTIONS, errors, resetProg, warnings } from "./actions/actions.js";
import { CodeJar } from "https://medv.io/codejar/codejar.js";
const editor = document.querySelector("#editor");
let jar = CodeJar(editor, (e) => {
  // e.innerHTML = theCodeHTML;
});
jar.updateCode(`dw a = 13;
a = a+1-4;

//if else

if(a==10){
	AX:=1;
	DEC CX; // 8086 allowed
	b = 3; // what's b? (see warning)
} else{
	AX := 0;
}
//while loop

db c = 3;
while(c != 0){
	--c;
	++AX;
}
end;`)
let code = jar.toString();
editor.addEventListener("keyup", () => {
  code = jar.toString();
  // document.querySelector("pre#hidden code").innerHTML = code;
})
// export const DATA_DECLARATIONS = [];
// export const INSTRUCTIONS = [];
const outputDiv = document.getElementById("output");
const errorsDiv = document.getElementById("errors");
const warningsDiv = document.getElementById("warnings");
const codeText = document.getElementById("code");
const p8086 = ohm.grammar(grammar);
const s = p8086.createSemantics();
s.addOperation("eval", actions);
function compile() {
  outputDiv.innerHTML = "";
  errorsDiv.innerHTML = "";
  warningsDiv.innerHTML = "";
  resetProg();
  const matchResult = p8086.match(jar.toString());
  if (matchResult.succeeded()) {
    try { s(matchResult).eval(); } catch (e) {
      console.error("[Compiling error]", e);
    }
    if (errors.length != 0) {
      // logsDiv.innerHTML = errors.join("<br>");
      displayErrors();
      return;
    }
    displayWarnings();
    outputDiv.innerHTML += "<br>.DATA<br>"
    outputDiv.innerHTML += DATA_DECLARATIONS.join("<br>");
    outputDiv.innerHTML += "<br>.CODE<br>"
    outputDiv.innerHTML += INSTRUCTIONS.join("<br>");
  } else {
    errorsDiv.innerHTML = matchResult.message;
    // console.error(matchResult.message);
  }
}
document.getElementById("compile").addEventListener("click", e => {
  compile();
})
function displayErrors() {
  // errorsDiv.innerHTML = errors.join("<br>");
  // errors.
  let str = "";
  errors.forEach(error => str += wrapSectionInHref(error));
  errorsDiv.innerHTML = str;
}
function displayWarnings() {
  warningsDiv.innerHTML = warnings.join("<br>");
}
/**
 * Wraps any section references like §1.2.4 with <a> tags
 * @param {string} str String to process
 */
function wrapSectionInHref(str) {
  str = str.replace(/§(\d+\.)*\d/ig, "<a href='$&'>$&</a>")
  return str;
}
// Ctrl+Enter
// document.addEventListener('keydown', function (event) {
//   if (event.ctrlKey && event.key === 'Enter') {
//     compile();
//   }
// });
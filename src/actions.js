const variableActions = {
  VariableStatement(typeName, varDeclaration) {
    // console.log(typeName.sourceString, varList.sourceString);
    const c = varDeclaration.children;
    console.log(c);
    const i = varDeclaration.eval();
    console.log(typeName.sourceString, i.identifier, i.initialiser);
  },
  Initialiser(_, val) {
    console.log("initialiser = ", val.sourceString);
    return val.sourceString;
  },
  VariableDeclaration(identifier, init) {
    console.log(init);
    return { identifier: identifier.sourceString, initialiser: init.children.length == 0 ? "" : init.eval().join("") };
  },
}
const actions = {
  _iter(...children) {
    return children.map((c) => c.eval());
  },
  Statement(s, _) {
    s.eval();
  },
  ...variableActions,
}
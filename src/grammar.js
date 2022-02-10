export const grammar = String.raw`
p8086 { 
  Program = Instruction*
  Instruction = Statement | Masm86Instruction // | Declaration
  Statement (a p8086 statement) = SCStatement | BlockStatement
  SCStatement= ( VariableStatement
              | AssignmentExpression
              | ShortcutStatement
              | PrefixExpression
              | PrintStatement
              | EndStatement
              | FunctionCallExpression
              //|EmptyStatement 
              ) ";" //IterationStmt | IfStatement | Continue, break, 

  ShortcutStatement = MovShortcut
  
  MovShortcut = LValue ":=" (LValue | numberLiteral)

  BlockStatement = (EmptyStatement | IfStatement | IterationStatement) ";"?
  
  IterationStatement = WhileStatement | ForStatement
  
    ForStatement = for "("  ForStatExpr? ";"? ConditionExpr? ";"+ ForStatExpr? ")" Block

  ForStatExpr = VariableStatement | AssignmentExpression | Masm86Instruction  | EmptyStatement | PrefixExpression

  EmptyStatement = ";"
  
  FunctionCallExpression = FName Arguments

  FName = identifier ("." identifier)*

  Arguments = "(" ListOf<LValue, ","> ")"

  WhileStatement = while ConditionExpr Block

  IfStatement = if ConditionExpr Block (else Block)?

  ConditionExpr = "(" ConditionalExpression ")" --paren 
                | ConditionalExpression

  Block = Instruction | "{" Program "}" --block

  ConditionalExpression = LValue conditionalOperator RValue

  conditionalOperator = "=="|"!="|"==="|"!=="|"<"|"<="|">"|">="
  
  EndStatement = endP
  
  VariableStatement (variable declaration) = typeName VariableDeclaration//VariableDeclarationList

  VariableDeclarationList = NonemptyListOf<VariableDeclaration, ",">

  VariableDeclaration = identifier Initialiser?

  Initialiser = "=" (immediateValue | stringLiteral)

  //ExpressionStatement = AssignmentExpression | RValue

  PrintStatement (print statement) = print #(space* ~space) PrintExpression

  PrefixExpression (operation statement) = ("++" | "--" ) LValue //#(space* ~space "++")
                    //| LValue #(space* ~space "--")

  AssignmentExpression (assignment expression)
                  = LValue assignmentOperator AssignRight //AssignmentExpression 
             
  AssignRight (rvalue) = AssignmentExpression | RValue
  
  LValue = register | identifier | MemoryAddress
  
  P_LValue = register | identifier | MemoryAddress

  RValue = PrimaryExpression//"(" RValue ")" --parenthesized
        // | LValue
        // | immediateValue
  
  PrimaryExpression = "(" PrimaryExpression ")" --paren
                    | AdditiveExpression

  AdditiveExpression = AdditiveExpression "+" MultiplicativeExpression -- add
                     | AdditiveExpression "-" MultiplicativeExpression -- sub
                     | MultiplicativeExpression
  MultiplicativeExpression = MultiplicativeExpression "*" UnaryExpression -- mul
                           | MultiplicativeExpression "/" UnaryExpression -- div
                           | MultiplicativeExpression "%" UnaryExpression -- mod
                           | UnaryExpression
  
  UnaryExpression = "+" UnaryExpression -- unaryPlus
                  | "-" UnaryExpression -- unaryMinus
                  | "!" UnaryExpression -- logicNot
                  | P_LValue
                  | immediateValue
                  | PrimaryExpression

  PrintExpression = "(" PrintExpression ")" --paren
                  | constantLiteral
                  | MemoryAddress
                  | pStringLiteral

  MemoryAddress = "[" effectiveAddress "]"

  constantLiteral (expression for print)
              = identifier | immediateValue //| stringLiteral

  pStringLiteral = "\"" stringCharacter+ "\""

  assignmentOperator = "="| "+=" | "-=" | "&=" | "|="

  immediateValue = numberLiteral | characterLiteral

  characterLiteral = "'" any "'"

  stringLiteral = "\"" stringCharacter+ "\""

  stringCharacter = ~("\"" | "\\" | lineTerminator) any

  numberLiteral (a number) =  hexNumber | decimal

  decimal = digit+

  hexNumber = hexDigit hexDigit? hexDigit? hexDigit? "H" //can be max 4 digits

  space += comment
  comment = multiLineComment | singleLineComment
  multiLineComment = "/*" (~"*/" any)* "*/"
  singleLineComment = "//" (~lineTerminator any)* (lineTerminator | end)
  lineTerminator = "\n" | "\r"

  typeName = db | dw | var | string

  identifier (an identifier) = ~reservedWord identifierName

  identifierName = identifierStart identifierPart*

  identifierStart = letter

  identifierPart = alnum

  effectiveAddress = numberLiteral | addressRegister

  reservedWord = db | dw | var | while | if | print
                | return | else | continue | for | endP

  db = "db" ~identifierPart
  // #Named as "endP" because "end" is a built-in rule in OHM
  endP = "end" ~identifierPart
  dw = "dw" ~identifierPart
  string = "string" ~identifierPart
  print = "print" ~identifierPart
  while = "while" ~identifierPart
  if = "if" ~identifierPart
  return = "return" ~identifierPart
  else = "else" ~identifierPart
  continue = "continue" ~identifierPart
  for = "for" ~identifierPart
  var = "var" ~identifierPart
  addressRegister = ("SI" | "DI" | "BX") ~identifierPart
  register = ("AX" | "BX" | "CX" | "DX" | "AL" | "AH" | "BH" | "BL" | "CL" | "CH" | "DL" | "DH" ) ~identifierPart

  Masm86Instruction (8086 instruction) = MasmOperation | MasmLabel //#label does'nt require new line

  MasmOperation = (directive | MasmCommand | MasmDeclaration) ";"

  MasmLabel = identifier ":"

  MasmDeclaration = identifier typeName (numberLiteral | "?")

  directive = "." aDirective space* identifier?

  aDirective (a valid 8086 directive) = (caseInsensitive<"END"> | caseInsensitive<"MODEL"> | caseInsensitive<"STACK"> | caseInsensitive<"CODE"> | caseInsensitive<"STARTUP"> | caseInsensitive<"DATA"> | caseInsensitive<"EXIT">) ~identifierPart

  MasmCommand (an 8086 command)  = masmCommands ListOf<masmArgument, "," > //# (~lineTerminator ~end any)*//ListOf<identifier?, ("," | " ")>

  masmArgument = (alnum| " ")+

  masmCommands = ("END" | caseInsensitive<"AAA"> | caseInsensitive<"AAD"> | caseInsensitive<"AAM"> | caseInsensitive<"AAS"> | caseInsensitive<"ADC"> | caseInsensitive<"ADD"> | caseInsensitive<"AND"> | caseInsensitive<"CALL"> | caseInsensitive<"CBW"> | caseInsensitive<"CLC"> | caseInsensitive<"CLD"> | caseInsensitive<"CLI"> | caseInsensitive<"CMC"> | caseInsensitive<"CMP"> | caseInsensitive<"CMPSB"> | caseInsensitive<"CMPSW"> | caseInsensitive<"CWD"> | caseInsensitive<"DAA"> | caseInsensitive<"DAS"> | caseInsensitive<"DEC"> | caseInsensitive<"DIV"> | caseInsensitive<"HLT"> | caseInsensitive<"IDIV"> | caseInsensitive<"IMUL"> | caseInsensitive<"IN"> | caseInsensitive<"INC"> | caseInsensitive<"INT"> | caseInsensitive<"INTO"> | caseInsensitive<"IRET"> | caseInsensitive<"JA"> | caseInsensitive<"JAE"> | caseInsensitive<"JB"> | caseInsensitive<"JBE"> | caseInsensitive<"JC"> | caseInsensitive<"JCXZ"> | caseInsensitive<"JE"> | caseInsensitive<"JG"> | caseInsensitive<"JGE"> | caseInsensitive<"JL"> | caseInsensitive<"JLE"> | caseInsensitive<"JMP"> | caseInsensitive<"JNA"> | caseInsensitive<"JNAE"> | caseInsensitive<"JNB"> | caseInsensitive<"JNBE"> | caseInsensitive<"JNC"> | caseInsensitive<"JNE"> | caseInsensitive<"JNG">
  | caseInsensitive<"JNGE"> | caseInsensitive<"JNL"> | caseInsensitive<"JNLE"> | caseInsensitive<"JNO"> | caseInsensitive<"JNP"> | caseInsensitive<"JNS"> | caseInsensitive<"JNZ"> | caseInsensitive<"JO"> | caseInsensitive<"JP"> | caseInsensitive<"JPE"> | caseInsensitive<"JPO"> | caseInsensitive<"JS"> | caseInsensitive<"JZ"> | caseInsensitive<"LAHF"> | caseInsensitive<"LDS"> | caseInsensitive<"LEA"> | caseInsensitive<"LES"> | caseInsensitive<"LODSB"> | caseInsensitive<"LODSW"> | caseInsensitive<"LOOP"> | caseInsensitive<"LOOPE"> | caseInsensitive<"LOOPNE"> | caseInsensitive<"LOOPNZ"> | caseInsensitive<"LOOPZ"> | caseInsensitive<"MOV"> | caseInsensitive<"MOVSB"> | caseInsensitive<"MOVSW"> | caseInsensitive<"MUL"> | caseInsensitive<"NEG"> | caseInsensitive<"NOP"> | caseInsensitive<"NOT"> | caseInsensitive<"OR"> | caseInsensitive<"OUT"> | caseInsensitive<"POP"> | caseInsensitive<"POPA"> | caseInsensitive<"POPF"> | caseInsensitive<"PUSH"> | caseInsensitive<"PUSHA"> | caseInsensitive<"PUSHF"> | caseInsensitive<"RCL"> | caseInsensitive<"RCR"> | caseInsensitive<"REP"> | caseInsensitive<"REPE"> | caseInsensitive<"REPNE"> | caseInsensitive<"REPNZ"> | caseInsensitive<"REPZ"> | caseInsensitive<"RET"> | caseInsensitive<"RETF"> | caseInsensitive<"ROL"> | caseInsensitive<"ROR"> | caseInsensitive<"SAHF"> | caseInsensitive<"SAL"> | caseInsensitive<"SAR"> | caseInsensitive<"SBB"> | caseInsensitive<"SCASB"> | caseInsensitive<"SCASW"> | caseInsensitive<"SHL"> | caseInsensitive<"SHR"> | caseInsensitive<"STC"> | caseInsensitive<"STD"> | caseInsensitive<"STI"> | caseInsensitive<"STOSB"> | caseInsensitive<"STOSW"> | caseInsensitive<"SUB"> | caseInsensitive<"TEST"> | caseInsensitive<"XCHG"> | caseInsensitive<"XLATB"> | caseInsensitive<"XOR">) ~identifierPart

}
`;
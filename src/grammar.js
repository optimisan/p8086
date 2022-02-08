const grammar = String.raw`
p8086 { 
  Program = Instruction*
  Instruction = Statement // | Declaration
  Statement = (VariableStatement | AssignmentExpression | PrintStatement | ";" ) ";" //IterationStmt | IfStatement | Continue, break, 

  VariableStatement = typeName VariableDeclaration//VariableDeclarationList

  VariableDeclarationList = NonemptyListOf<VariableDeclaration, ",">

  VariableDeclaration = identifier Initialiser?

  Initialiser = "=" numberLiteral

  //ExpressionStatement = AssignmentExpression | RValue

  PrintStatement = print #(space* ~space) PrintExpression

  AssignmentExpression
                  = LValue assignmentOperator AssignRight //AssignmentExpression 
             
  AssignRight = AssignmentExpression | RValue
  
  LValue = register | identifier | MemoryAddress

  RValue = "(" RValue ")" --parenthesized
         | LValue
         | immediateValue

  PrintExpression = "(" PrintExpression ")" --paren
                  | constantLiteral
                  | MemoryAddress

  MemoryAddress = "[" effectiveAddress "]"

  constantLiteral (expression for print)
              = identifier | immediateValue | stringLiteral

  assignmentOperator = "=" | "+=" | "-=" | "&=" | "|="

  immediateValue = numberLiteral | characterLiteral

  characterLiteral = "'" any "'"

  stringLiteral = "\"" stringCharacter "\""

  stringCharacter = ~("\"" | "\\" | lineTerminator) any

  numberLiteral (a number) =  hexNumber | decimal

  decimal = digit+

  hexNumber = hexDigit hexDigit? hexDigit? hexDigit? "H" //can be max 4 digits

  space += comment
  comment = multiLineComment | singleLineComment
  multiLineComment = "/*" (~"*/" any)* "*/"
  singleLineComment = "//" (~lineTerminator any)* lineTerminator
  lineTerminator = "\n" | "\r"

  typeName = db | dw | var

  identifier (an identifier) = ~reservedWord identifierName

  identifierName = identifierStart identifierPart*

  identifierStart = letter

  identifierPart = alnum

  effectiveAddress = numberLiteral | addressRegister

  reservedWord = db | dw | var | while | if | print
                | return | else | continue | for

  db = "db" ~identifierPart
  dw = "dw" ~identifierPart
  print = "print" ~identifierPart
  while = "while" ~identifierPart
  if = "if" ~identifierPart
  return = "return" ~identifierPart
  else = "else" ~identifierPart
  continue = "continue" ~identifierPart
  for = "for" ~identifierPart
  var = "var" ~identifierPart
  addressRegister = ("SI" | "DI" | "BX" ) ~identifierPart
  register = ("AX" | "BX" | "CX" | "DX" | "AL" | "AH" | "BH" | "BL" | "CL" | "CH" | "DL" | "DH" ) ~identifierPart
}
`;
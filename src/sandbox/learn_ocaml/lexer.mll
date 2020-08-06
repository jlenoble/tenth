{
  open Parser;;
}

let digit = ['0'-'9']

rule token = parse
  | [' ' '\t'] { token lexbuf }
  | '\n' { NEWLINE }
  | digit+
  | "." digit+
  | digit+ "." digit* as num { NUM (float_of_string num) }
  | '+' { PLUS }
  | '-' { MINUS }
  | '*' { MULTIPLY }
  | '/' { DIVIDE }
  | '^' { CARET }
  | 'n' { UMINUS }
  | _ { token lexbuf }
  | eof { exit 0 }

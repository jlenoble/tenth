open Lexer;;

let lexbuf = Lexing.from_channel stdin in
  while true do
    translate lexbuf
  done

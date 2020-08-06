open Lexer;;

let lexbuf =
  let cin =
    if Array.length Sys.argv > 1
    then open_in Sys.argv.(1)
    else stdin
  in
    Lexing.from_channel cin
  in
    while true do
      Parser.input Lexer.token lexbuf
    done

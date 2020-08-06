{

}

rule translate = parse
| "current_directory" { print_string (Sys.getcwd ()) }
| _ as c              { print_char c                 }
| eof                 { exit 0                       }

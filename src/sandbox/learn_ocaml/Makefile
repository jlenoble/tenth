main: parser.cmo lexer.cmo main.cmo
	ocamlc -o $@ $^ 

main.cmo: parser.cmi lexer.cmi

.phony: clean

clean:
	rm -f *.cmo *.cmi lexer.ml parser.ml parser.mli

parser.cmo: parser.ml parser.cmi
	ocamlc -c $<

parser.cmi: parser.mli
	ocamlc -c $<

lexer.cmo lexer.cmi: lexer.ml parser.cmi
	ocamlc -c $<

%.cmo: %.ml
	ocamlc -c $<

%.cmi: %.mli %.ml
	ocamlc -c $<

%.ml: %.mll
	ocamllex $<

%.ml %.mli: %.mly
	ocamlyacc -v $<

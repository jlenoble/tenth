main: lexer.cmo main.cmo 
	ocamlc -o $@ $^

.phony: clean

clean:
	rm -f main *.cmo *.cmi lexer.ml

main.cmo: main.ml lexer.cmi
	ocamlc -c $<

lexer.cmo lexer.cmi: lexer.ml
	ocamlc -c $<

%.cmo: %.ml
	ocamlc -c $<
	
%.ml: %.mll
	ocamllex $<

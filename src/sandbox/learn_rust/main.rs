use std::{env, process};

mod cons_list;

use cons_list::List::{Cons, Nil};
use learn_rust::{run, Config};

fn main() {
  let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));

  let config = Config::new(env::args()).unwrap_or_else(|err| {
    eprintln!("Problem parsing arguments: {}", err);
    process::exit(1);
  });

  if let Err(e) = run(config) {
    eprintln!("Application error: {}", e);

    process::exit(1);
  }
}

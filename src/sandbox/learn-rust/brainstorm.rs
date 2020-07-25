#[derive(Debug, PartialEq)]
pub struct Idea(String);

impl Idea {
  pub fn new() -> Self {
    Idea(String::from(""))
  }
}

#[test]
fn new_idea() {
  assert_eq!(Idea::new(), Idea(String::from("")));
}

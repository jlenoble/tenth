#[derive(Debug, Default, PartialEq)]
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

#[test]
fn default_idea() {
  assert_eq!(Idea::default(), Idea::new());
  let idea: Idea = Default::default();
  assert_eq!(idea, Idea(String::from("")));
}

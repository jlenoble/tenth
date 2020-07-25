#[derive(Debug, Default, PartialEq)]
pub struct Idea(String);

impl Idea {
  pub fn new() -> Self {
    Idea(String::from(""))
  }
}

impl From<&str> for Idea {
  fn from(idea: &str) -> Self {
    Idea(String::from(idea))
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

#[test]
fn from_str() {
  let idea = Idea("idea".to_string());
  assert_eq!(idea, Idea::from("idea"));
}

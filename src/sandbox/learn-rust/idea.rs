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

impl AsRef<str> for Idea {
  fn as_ref(&self) -> &str {
    self.0.as_ref()
  }
}

#[cfg(test)]
mod tests {
  use super::*;

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
  fn idea_from_str() {
    let idea = Idea("idea".to_string());
    assert_eq!(idea, Idea::from("idea"));
  }

  #[test]
  fn idea_as_ref() {
    let idea = Idea(String::from("idea"));
    assert_eq!("idea", idea.as_ref());
  }
}

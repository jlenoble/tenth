use std::cell::RefCell;
use std::fmt;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::console;

fn window() -> web_sys::Window {
  web_sys::window().expect("no global `window` exists")
}

fn request_animation_frame(f: &Closure<dyn FnMut(f64) -> ()>) {
  window()
    .request_animation_frame(f.as_ref().unchecked_ref())
    .expect("should register `requestAnimationFrame` OK");
}

fn document() -> web_sys::Document {
  window()
    .document()
    .expect("should have a document on window")
}

fn body() -> web_sys::HtmlElement {
  document().body().expect("document should have a body")
}

// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
  // This provides better error messages in debug mode.
  // It's disabled in release mode so it doesn't bloat up the file size.
  #[cfg(feature = "console_error_panic_hook")]
  console_error_panic_hook::set_once();

  // Your code goes here!
  console::log_1(&JsValue::from_str("Hello world!!!"));

  // Here we want to call `requestAnimationFrame` in a loop, but only a fixed
  // number of times. After it's done we want all our resources cleaned up. To
  // achieve this we're using an `Rc`. The `Rc` will eventually store the
  // closure we want to execute on each frame, but to start out it contains
  // `None`.
  //
  // After the `Rc` is made we'll actually create the closure, and the closure
  // will reference one of the `Rc` instances. The other `Rc` reference is
  // used to store the closure, request the first frame, and then is dropped
  // by this function.
  //
  // Inside the closure we've got a persistent `Rc` reference, which we use
  // for all future iterations of the loop
  let f = Rc::new(RefCell::new(None));
  let g = f.clone();
  let pre = document().create_element("pre")?;
  body().append_child(&pre)?;
  let mut universe = Universe::new();

  let mut start = 0f64;
  *g.borrow_mut() = Some(Closure::wrap(Box::new(move |timestamp: f64| {
    if start == 0f64 {
      start = timestamp
    };

    let elapsed = timestamp - start;

    if elapsed > 20000. {
      // Drop our handle to this closure so that it will get cleaned
      // up once we return.
      let _ = f.borrow_mut().take();
      return;
    }

    // Set the body's text content to how many times this
    // requestAnimationFrame callback has fired.
    let text = &universe.render();
    pre.set_inner_html(text);
    universe.tick();
    console::log_1(&JsValue::from_str(&elapsed.to_string()));

    // Schedule ourself for another requestAnimationFrame callback.
    request_animation_frame(f.borrow().as_ref().unwrap());
  }) as Box<dyn FnMut(f64) -> ()>));

  request_animation_frame(g.borrow().as_ref().unwrap());
  Ok(())
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
  Dead = 0,
  Alive = 1,
}

#[wasm_bindgen]
pub struct Universe {
  width: u32,
  height: u32,
  cells: Vec<Cell>,
}

impl Universe {
  fn get_index(&self, row: u32, column: u32) -> usize {
    (row * self.width + column) as usize
  }

  fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
    let mut count = 0;
    for delta_row in [self.height - 1, 0, 1].iter().cloned() {
      for delta_col in [self.width - 1, 0, 1].iter().cloned() {
        if delta_row == 0 && delta_col == 0 {
          continue;
        }

        let neighbor_row = (row + delta_row) % self.height;
        let neighbor_col = (column + delta_col) % self.width;
        let idx = self.get_index(neighbor_row, neighbor_col);
        count += self.cells[idx] as u8;
      }
    }
    count
  }
}

/// Public methods, exported to JavaScript.
#[wasm_bindgen]
impl Universe {
  pub fn tick(&mut self) {
    let mut next = self.cells.clone();

    for row in 0..self.height {
      for col in 0..self.width {
        let idx = self.get_index(row, col);
        let cell = self.cells[idx];
        let live_neighbors = self.live_neighbor_count(row, col);

        let next_cell = match (cell, live_neighbors) {
          // Rule 1: Any live cell with fewer than two live neighbours
          // dies, as if caused by underpopulation.
          (Cell::Alive, x) if x < 2 => Cell::Dead,
          // Rule 2: Any live cell with two or three live neighbours
          // lives on to the next generation.
          (Cell::Alive, 2) | (Cell::Alive, 3) => Cell::Alive,
          // Rule 3: Any live cell with more than three live
          // neighbours dies, as if by overpopulation.
          (Cell::Alive, x) if x > 3 => Cell::Dead,
          // Rule 4: Any dead cell with exactly three live neighbours
          // becomes a live cell, as if by reproduction.
          (Cell::Dead, 3) => Cell::Alive,
          // All other cells remain in the same state.
          (otherwise, _) => otherwise,
        };

        next[idx] = next_cell;
      }
    }

    self.cells = next;
  }

  pub fn new() -> Universe {
    let width = 64;
    let height = 64;

    let cells = (0..width * height)
      .map(|i| {
        if i % 2 == 0 || i % 7 == 0 {
          Cell::Alive
        } else {
          Cell::Dead
        }
      })
      .collect();

    Universe {
      width,
      height,
      cells,
    }
  }

  pub fn render(&self) -> String {
    self.to_string()
  }
}

impl fmt::Display for Universe {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    for line in self.cells.as_slice().chunks(self.width as usize) {
      for &cell in line {
        let symbol = if cell == Cell::Dead { '◻' } else { '◼' };
        write!(f, "{}", symbol)?;
      }
      write!(f, "\n")?;
    }

    Ok(())
  }
}

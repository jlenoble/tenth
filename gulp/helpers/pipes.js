import PolyPipe from "polypipe";
import babel from "gulp-babel";
import through from "through2";
import filter from "gulp-filter";
import debug from "gulp-debug";
import changed from "gulp-changed";

const noop = () => through.obj();

// Transpile pipeline
export const transpilePipe = new PolyPipe(babel);

// Copy pipeline
export const copyPipe = new PolyPipe(noop);

export const copyRustPipe = new PolyPipe(
  [changed, "src/sandbox/learn_rust"],
  debug,
  () => filter(["**", "!*dev-build/rust/.git"], { dot: true }),
  debug
);

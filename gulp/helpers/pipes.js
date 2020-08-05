import PolyPipe from "polypipe";
import babel from "gulp-babel";
import through from "through2";
import filter from "gulp-filter";
import debug from "gulp-debug";

const noop = () => through.obj();

// Transpile pipeline
export const transpilePipe = new PolyPipe(babel);

// Copy pipeline
export const copyPipe = new PolyPipe(noop);

export const copyRustPipe = new PolyPipe(
  debug,
  () => filter(["**", "!*dev-build/rust/.git"], { dot: true }),
  debug
);

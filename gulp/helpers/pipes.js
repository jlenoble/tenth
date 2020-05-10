import PolyPipe from "polypipe";
import babel from "gulp-babel";
import through from "through2";

const noop = () => through.obj();

// Transpile pipeline
export const transpilePipe = new PolyPipe(babel);

// Copy pipeline
export const copyPipe = new PolyPipe(noop);
